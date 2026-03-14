<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'condition' => ['required', 'in:A,B,C,D'],
            'price' => ['required', 'numeric', 'min:0'],
            'size' => ['nullable', 'string', 'max:50'],
            'weight' => ['required', 'integer', 'min:1'],
            'photos' => ['required', 'array', 'min:1', 'max:8'],
            'photos.*' => ['image', 'max:4096'],
            'primary_photo_index' => ['nullable', 'integer', 'min:0', 'max:7'],
        ]);

        $store = $request->user()->store;

        if (! $store) {
            return $this->error('User belum memiliki toko.', 422);
        }

        if (blank($store->address) || $store->couriers()->count() < 1) {
            return $this->error('Toko wajib punya alamat dan minimal 1 kurir.', 422);
        }

        $product = DB::transaction(function () use ($validated, $store) {
            $slug = Str::slug($validated['name']).'-'.Str::random(6);

            $product = Product::query()->create([
                'store_id' => $store->id,
                'category_id' => $validated['category_id'],
                'name' => $validated['name'],
                'slug' => $slug,
                'description' => $validated['description'],
                'condition' => $validated['condition'],
                'price' => $validated['price'],
                'size' => $validated['size'] ?? null,
                'weight' => $validated['weight'],
                'status' => 'active',
            ]);

            $primaryIndex = $validated['primary_photo_index'] ?? 0;

            foreach ($validated['photos'] as $index => $file) {
                $path = $file->store('products', 'public');
                $product->photos()->create([
                    'photo_url' => $path,
                    'is_primary' => $index === $primaryIndex,
                    'sort_order' => $index + 1,
                ]);
            }

            return $product->load('photos');
        });

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil dibuat.',
            'data' => $product,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::query()->where('id', $id)->first();

        if (! $product || $product->store?->user_id !== $request->user()->id) {
            return $this->error('Produk tidak ditemukan atau bukan milik Anda.', 404);
        }

        $validated = $request->validate([
            'category_id' => ['sometimes', 'exists:categories,id'],
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'condition' => ['sometimes', 'in:A,B,C,D'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'size' => ['nullable', 'string', 'max:50'],
            'weight' => ['sometimes', 'integer', 'min:1'],
            'status' => ['sometimes', 'in:active,inactive'],
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']).'-'.Str::random(6);
        }

        $product->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil diperbarui.',
            'data' => $product->fresh()->load('photos'),
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $product = Product::query()->find($id);

        if (! $product || $product->store?->user_id !== $request->user()->id) {
            return $this->error('Produk tidak ditemukan atau bukan milik Anda.', 404);
        }

        $product->update(['status' => 'inactive']);

        return response()->json([
            'success' => true,
            'message' => 'Produk dinonaktifkan.',
            'data' => $product,
        ]);
    }

    public function toggle(Request $request, int $id): JsonResponse
    {
        $product = Product::query()->find($id);

        if (! $product || $product->store?->user_id !== $request->user()->id) {
            return $this->error('Produk tidak ditemukan atau bukan milik Anda.', 404);
        }

        $nextStatus = $product->status === 'active' ? 'inactive' : 'active';
        $product->update(['status' => $nextStatus]);

        return response()->json([
            'success' => true,
            'message' => 'Status produk berhasil diubah.',
            'data' => $product,
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
