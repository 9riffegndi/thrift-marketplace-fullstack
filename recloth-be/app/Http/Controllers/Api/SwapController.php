<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Swap;
use App\Services\NotificationService;
use App\Services\RajaOngkirService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SwapController extends Controller
{
    public function __construct(private readonly RajaOngkirService $rajaOngkirService, private readonly NotificationService $notificationService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $swaps = Swap::query()
            ->with(['order', 'requesterProduct', 'targetProduct.store'])
            ->whereHas('order', fn ($q) => $q->where('buyer_id', $request->user()->id))
            ->orWhereHas('targetProduct.store', fn ($q) => $q->where('user_id', $request->user()->id))
            ->latest()
            ->paginate($request->query('per_page', 15));

        return response()->json(['success' => true, 'message' => 'OK', 'data' => $swaps]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'requester_product_id' => ['required', 'exists:products,id'],
            'target_product_id' => ['required', 'exists:products,id'],
        ]);

        $requester = Product::query()->findOrFail($validated['requester_product_id']);
        $target = Product::query()->findOrFail($validated['target_product_id']);

        if ($requester->status !== 'active' || $target->status !== 'active') {
            return $this->error('Produk swap harus aktif dan tersedia.', 422);
        }

        $swap = DB::transaction(function () use ($request, $requester, $target) {
            $order = Order::query()->create([
                'buyer_id' => $request->user()->id,
                'store_id' => $target->store_id,
                'product_id' => $target->id,
                'type' => 'swap',
                'status' => 'dikonfirmasi',
                'subtotal' => 0,
                'ongkir' => 0,
                'diskon' => 0,
                'total' => 0,
                'escrow_status' => 'held',
            ]);

            return Swap::query()->create([
                'order_id' => $order->id,
                'requester_product_id' => $requester->id,
                'target_product_id' => $target->id,
                'status' => 'diajukan',
            ]);
        });

        $this->notificationService->send(
            $target->store->user,
            'swap_submitted',
            'Permintaan swap baru',
            'Ada permintaan swap untuk produk Anda.',
            ['swap_id' => $swap->id]
        );

        return response()->json(['success' => true, 'message' => 'Swap berhasil diajukan.', 'data' => $swap], 201);
    }

    public function respond(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate(['action' => ['required', 'in:terima,tolak']]);
        $swap = Swap::query()->with(['targetProduct.store', 'requesterProduct'])->find($id);

        if (! $swap || $swap->targetProduct->store->user_id !== $request->user()->id) {
            return $this->error('Swap tidak ditemukan atau bukan target seller.', 404);
        }

        if ($validated['action'] === 'tolak') {
            $swap->update(['status' => 'ditolak']);
            return response()->json(['success' => true, 'message' => 'Swap ditolak.', 'data' => $swap]);
        }

        DB::transaction(function () use ($swap) {
            $swap->update(['status' => 'diterima']);
            $swap->requesterProduct->update(['status' => 'reserved']);
            $swap->targetProduct->update(['status' => 'reserved']);
        });

        return response()->json(['success' => true, 'message' => 'Swap diterima.', 'data' => $swap->fresh()]);
    }

    public function inputResi(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate(['resi' => ['required', 'string'], 'courier_code' => ['required', 'in:jne,jnt,sicepat,pos,ninja']]);
        $swap = Swap::query()->with(['order', 'targetProduct.store'])->find($id);

        if (! $swap) {
            return $this->error('Swap tidak ditemukan.', 404);
        }

        if (! $this->rajaOngkirService->validateWaybill($validated['resi'], $validated['courier_code'])) {
            return $this->error('Resi tidak valid.', 422);
        }

        $isBuyer = $swap->order->buyer_id === $request->user()->id;
        $isSeller = $swap->targetProduct->store->user_id === $request->user()->id;

        if (! $isBuyer && ! $isSeller) {
            return $this->error('Akses ditolak.', 403);
        }

        $swap->update([$isBuyer ? 'buyer_resi' : 'seller_resi' => $validated['resi']]);

        return response()->json(['success' => true, 'message' => 'Resi swap disimpan.', 'data' => $swap]);
    }

    public function confirm(Request $request, int $id): JsonResponse
    {
        $swap = Swap::query()->with(['order', 'requesterProduct', 'targetProduct'])->find($id);

        if (! $swap) {
            return $this->error('Swap tidak ditemukan.', 404);
        }

        $isBuyer = $swap->order->buyer_id === $request->user()->id;
        $isSeller = $swap->targetProduct->store->user_id === $request->user()->id;

        if (! $isBuyer && ! $isSeller) {
            return $this->error('Akses ditolak.', 403);
        }

        if ($isBuyer) {
            $swap->buyer_resi = $swap->buyer_resi ?: 'confirmed';
        }

        if ($isSeller) {
            $swap->seller_resi = $swap->seller_resi ?: 'confirmed';
        }

        $swap->save();

        if ($swap->buyer_resi && $swap->seller_resi) {
            DB::transaction(function () use ($swap) {
                $swap->update(['status' => 'selesai']);
                $swap->requesterProduct->update(['status' => 'sold']);
                $swap->targetProduct->update(['status' => 'sold']);
            });
        }

        return response()->json(['success' => true, 'message' => 'Konfirmasi swap berhasil.', 'data' => $swap->fresh()]);
    }

    private function error(string $message, int $status): JsonResponse
    {
        return response()->json(['success' => false, 'message' => $message, 'data' => null], $status);
    }
}
