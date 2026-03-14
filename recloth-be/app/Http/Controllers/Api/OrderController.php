<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Services\EscrowService;
use App\Services\MidtransService;
use App\Services\RajaOngkirService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function __construct(
        private readonly MidtransService $midtransService,
        private readonly EscrowService $escrowService,
        private readonly RajaOngkirService $rajaOngkirService,
    ) {
    }

    public function checkout(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'address_id' => ['required', 'exists:addresses,id'],
            'courier_code' => ['required', 'in:jne,jnt,sicepat,pos,ninja,tiki'],
            'courier_service' => ['required', 'string', 'max:100'],
            'ongkir' => ['required', 'numeric', 'min:0'],
            'diskon' => ['nullable', 'numeric', 'min:0'],
            'payment_method' => ['required', 'in:qris,va_bca,va_mandiri,va_bni,va_bri,gopay,ovo,dana,shopepay,card,wallet'],
        ]);

        $order = DB::transaction(function () use ($request, $validated) {
            $product = Product::query()->lockForUpdate()->findOrFail($validated['product_id']);

            if ($product->status !== 'active') {
                abort(response()->json([
                    'success' => false,
                    'message' => 'Produk sudah tidak tersedia.',
                    'data' => null,
                ], 422));
            }

            $subtotal = (float) $product->price;
            $discount = (float) ($validated['diskon'] ?? 0);
            $shipping = (float) $validated['ongkir'];
            $commission = \App\Support\SystemConfigValue::float('platform_fee_fixed', 2500.00);
            $total = max(0, $subtotal + $shipping + $commission - $discount);

            // Handle Wallet Payment
            if ($validated['payment_method'] === 'wallet') {
                $wallet = $request->user()->wallet()->lockForUpdate()->first();
                if (!$wallet || $wallet->balance < $total) {
                    abort(response()->json([
                        'success' => false,
                        'message' => 'Saldo dompet tidak mencukupi.',
                        'data' => null,
                    ], 422));
                }

                $wallet->decrement('balance', $total);
                
                \App\Models\WalletTransaction::create([
                    'wallet_id' => $wallet->id,
                    'type' => 'payment',
                    'amount' => $total,
                    'description' => "Pembayaran order #" . ($product->id), // Will be updated after order created
                    'status' => 'done',
                ]);
            }

            $order = Order::query()->create([
                'buyer_id' => $request->user()->id,
                'store_id' => $product->store_id,
                'product_id' => $product->id,
                'type' => 'buy',
                'status' => $validated['payment_method'] === 'wallet' ? 'dikonfirmasi' : 'menunggu_bayar',
                'subtotal' => $subtotal,
                'ongkir' => $shipping,
                'diskon' => $discount,
                'komisi' => $commission,
                'total' => $total,
                'courier_code' => $validated['courier_code'],
                'courier_service' => $validated['courier_service'],
                'escrow_status' => 'held',
            ]);

            // Update description with real order id if wallet
            if ($validated['payment_method'] === 'wallet') {
                 $wallet->transactions()->latest()->first()->update([
                     'description' => "Pembayaran order #{$order->id}"
                 ]);
            }

            Payment::query()->create([
                'order_id' => $order->id,
                'method' => $validated['payment_method'],
                'midtrans_order_id' => 'RECLOTH-'.$order->id.'-'.time(),
                'amount' => $total,
                'status' => $validated['payment_method'] === 'wallet' ? 'success' : 'pending',
                'paid_at' => $validated['payment_method'] === 'wallet' ? now() : null,
            ]);

            $product->update(['status' => 'reserved']);

            return $order->load('payment', 'product');
        });

        if ($validated['payment_method'] === 'wallet') {
            return response()->json([
                'success' => true,
                'message' => 'Pembayaran menggunakan dompet berhasil!',
                'data' => [
                    'order' => $order,
                    'payment_url' => null,
                ],
            ], 201);
        }

        $midtransPayload = [
            'transaction_details' => [
                'order_id' => $order->payment->midtrans_order_id,
                'gross_amount' => (int) $order->total,
            ],
            'customer_details' => [
                'first_name' => $request->user()->name,
                'email' => $request->user()->email,
                'phone' => $request->user()->phone,
            ],
        ];

        $midtransResponse = $this->midtransService->createTransaction($midtransPayload);

        return response()->json([
            'success' => true,
            'message' => 'Checkout berhasil, lanjutkan pembayaran.',
            'data' => [
                'order' => $order,
                'payment_url' => data_get($midtransResponse, 'redirect_url'),
            ],
        ], 201);
    }

    public function buyerOrders(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'status'   => ['nullable', 'in:menunggu_bayar,dikonfirmasi,dikirim,selesai,dibatalkan,direfund'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $query = Order::with(['store:id,name,slug,photo', 'product:id,name,slug', 'payment:id,order_id,status,method'])
            ->where('buyer_id', $request->user()->id)
            ->latest();

        if (!empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        $orders = $query->paginate($validated['per_page'] ?? 15);

        return response()->json(['success' => true, 'message' => 'OK', 'data' => $orders]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $order = Order::with([
            'store:id,name,slug,photo,city,province',
            'product:id,name,slug',
            'product.photos',
            'buyer:id,name,phone',
            'payment',
            'review',
        ])->find($id);

        if (!$order) return $this->error('Order tidak ditemukan.', 404);

        $isBuyer  = $order->buyer_id === $request->user()->id;
        $isSeller = $order->store?->user_id === $request->user()->id;

        if (!$isBuyer && !$isSeller) {
            return $this->error('Anda tidak punya akses ke order ini.', 403);
        }

        return response()->json(['success' => true, 'message' => 'OK', 'data' => $order]);
    }

    public function sellerOrders(Request $request): JsonResponse
    {
        $store = $request->user()->store;

        if (! $store) {
            return $this->error('Toko tidak ditemukan.', 404);
        }

        $validated = $request->validate([
            'status' => ['nullable', 'in:menunggu_bayar,dikonfirmasi,dikirim,selesai,dibatalkan,direfund'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $query = Order::query()
            ->with(['buyer:id,name', 'product:id,name,slug'])
            ->where('store_id', $store->id)
            ->latest();

        if (! empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        $orders = $query->paginate($validated['per_page'] ?? 15);

        return response()->json([
            'success' => true,
            'message' => 'Pesanan toko berhasil diambil.',
            'data' => $orders,
        ]);
    }

    public function inputResi(Request $request, int $id): JsonResponse
    {
        $order = Order::query()->with('store')->find($id);

        if (! $order || $order->store?->user_id !== $request->user()->id) {
            return $this->error('Order tidak ditemukan atau bukan milik seller.', 404);
        }

        $validated = $request->validate([
            'resi' => ['required', 'string', 'max:100'],
            'courier_code' => ['required', 'in:jne,jnt,sicepat,pos,ninja'],
        ]);

        $isValid = $this->rajaOngkirService->validateWaybill($validated['resi'], $validated['courier_code']);
        if (! $isValid) {
            return $this->error('Resi tidak valid.', 422);
        }

        $order->update([
            'resi' => $validated['resi'],
            'courier_code' => $validated['courier_code'],
            'status' => 'dikirim',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Resi berhasil disimpan.',
            'data' => $order,
        ]);
    }

    public function tracking(Request $request, int $id): JsonResponse
    {
        $order = Order::query()->with('store')->find($id);

        if (! $order) {
            return $this->error('Order tidak ditemukan.', 404);
        }

        $isBuyer = $order->buyer_id === $request->user()->id;
        $isSeller = $order->store?->user_id === $request->user()->id;

        if (! $isBuyer && ! $isSeller) {
            return $this->error('Anda tidak punya akses ke order ini.', 403);
        }

        $tracking = $this->rajaOngkirService->getTracking((string) $order->resi, (string) $order->courier_code);

        return response()->json([
            'success' => true,
            'message' => 'Tracking berhasil diambil.',
            'data' => $tracking,
        ]);
    }

    public function confirm(Request $request, int $id): JsonResponse
    {
        $order = Order::query()->with('store.user.wallet')->find($id);

        if (! $order || $order->buyer_id !== $request->user()->id) {
            return $this->error('Order tidak ditemukan atau bukan milik buyer.', 404);
        }

        DB::transaction(function () use ($order) {
            $order->update(['status' => 'selesai']);
            $this->escrowService->releaseFunds($order->fresh('store.user.wallet'));
        });

        return response()->json([
            'success' => true,
            'message' => 'Order berhasil dikonfirmasi.',
            'data' => $order->fresh(),
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
