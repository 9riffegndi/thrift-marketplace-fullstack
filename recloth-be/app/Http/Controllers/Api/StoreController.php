<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StoreController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        if ($request->user()->store) {
            return $this->error('User sudah memiliki toko.', 422);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'photo' => ['nullable', 'image', 'max:4096'],
            'city' => ['required', 'string', 'max:100'],
            'province' => ['required', 'string', 'max:100'],
            'address' => ['required', 'string'],
            'couriers' => ['required', 'array', 'min:1'],
            'couriers.*' => ['in:jne,jnt,sicepat,pos,ninja'],
        ]);

        $store = DB::transaction(function () use ($request, $validated) {
            $photoPath = isset($validated['photo'])
                ? $request->file('photo')->store('stores', 'public')
                : null;

            $store = Store::query()->create([
                'user_id' => $request->user()->id,
                'name' => $validated['name'],
                'slug' => Str::slug($validated['name']).'-'.Str::random(6),
                'description' => $validated['description'] ?? null,
                'photo' => $photoPath,
                'city' => $validated['city'],
                'province' => $validated['province'],
                'address' => $validated['address'],
                'status' => 'active',
            ]);

            foreach (array_unique($validated['couriers']) as $courierCode) {
                $store->couriers()->create(['courier_code' => $courierCode]);
            }

            return $store->load('couriers');
        });

        return response()->json([
            'success' => true,
            'message' => 'Toko berhasil dibuat.',
            'data' => $store,
        ], 201);
    }

    public function show(string $slug): JsonResponse
    {
        $store = Store::query()
            ->withCount([
                'products as active_products_count' => fn ($q) => $q->where('status', 'active'),
                'followers'
            ])
            ->with('couriers')
            ->where(function ($query) use ($slug) {
                $query->where('slug', $slug);
                if (is_numeric($slug)) {
                    $query->orWhere('id', $slug);
                }
            })
            ->first();

        if (! $store || $store->status === 'suspended') {
            return $this->error('Toko tidak ditemukan.', 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Profil toko berhasil diambil.',
            'data' => $store,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $store = $request->user()->store;

        if (! $store) {
            return $this->error('Toko tidak ditemukan.', 404);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'photo' => ['nullable', 'image', 'max:4096'],
            'city' => ['sometimes', 'string', 'max:100'],
            'province' => ['sometimes', 'string', 'max:100'],
            'address' => ['sometimes', 'string'],
            'couriers' => ['sometimes', 'array', 'min:1'],
            'couriers.*' => ['in:jne,jnt,sicepat,pos,ninja'],
        ]);

        DB::transaction(function () use ($request, $validated, $store) {
            if ($request->hasFile('photo')) {
                $validated['photo'] = $request->file('photo')->store('stores', 'public');
            }

            if (! empty($validated['name'])) {
                $validated['slug'] = Str::slug($validated['name']).'-'.Str::random(6);
            }

            $store->update($validated);

            if (array_key_exists('couriers', $validated)) {
                $store->couriers()->delete();
                foreach (array_unique($validated['couriers']) as $code) {
                    $store->couriers()->create(['courier_code' => $code]);
                }
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Toko berhasil diperbarui.',
            'data' => $store->fresh()->load('couriers'),
        ]);
    }

    public function stats(Request $request): JsonResponse
    {
        $store = $request->user()->store;

        if (! $store) {
            return $this->error('Toko tidak ditemukan.', 404);
        }

        $stats = [
            'rating' => (float) $store->rating,
            'total_sales' => (int) $store->total_sales,
            'followers_count' => $store->followers()->count(),
            'active_products' => $store->products()->where('status', 'active')->count(),
            'completed_orders' => $store->orders()->where('status', 'selesai')->count(),
        ];

        return response()->json([
            'success' => true,
            'message' => 'Statistik toko berhasil diambil.',
            'data' => $stats,
        ]);
    }

    public function dashboard(Request $request): JsonResponse
    {
        $store = $request->user()->store;

        if (! $store) {
            return $this->error('Toko tidak ditemukan.', 404);
        }

        $recentOrders = $store->orders()->latest()->limit(5)->get();

        $summary = [
            'pending_orders' => $store->orders()->where('status', 'menunggu_bayar')->count(),
            'confirmed_orders' => $store->orders()->where('status', 'dikonfirmasi')->count(),
            'shipped_orders' => $store->orders()->where('status', 'dikirim')->count(),
            'completed_orders' => $store->orders()->where('status', 'selesai')->count(),
            'recent_orders' => $recentOrders,
        ];

        return response()->json([
            'success' => true,
            'message' => 'Dashboard toko berhasil diambil.',
            'data' => $summary,
        ]);
    }

    public function myProducts(Request $request): JsonResponse
    {
        $store = $request->user()->store;

        if (! $store) {
            return $this->error('Toko tidak ditemukan.', 404);
        }

        $validated = $request->validate([
            'status' => ['nullable', 'in:active,inactive,sold,reserved,suspended'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $query = $store->products()->with('photos')->latest();

        if (! empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        $products = $query->paginate($validated['per_page'] ?? 12);

        return response()->json([
            'success' => true,
            'message' => 'Daftar produk toko berhasil diambil.',
            'data' => $products,
        ]);
    }

    private function error(string $message, int $status): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => null,
        ], $status);
    }
}
