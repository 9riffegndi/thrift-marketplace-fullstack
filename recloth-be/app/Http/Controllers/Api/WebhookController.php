<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Services\EscrowService;
use App\Services\MidtransService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WebhookController extends Controller
{
    public function __construct(
        private readonly MidtransService $midtransService,
        private readonly EscrowService $escrowService,
    ) {
    }

    public function midtrans(Request $request): JsonResponse
    {
        $payload = $request->all();

        if (! $this->midtransService->verifySignature($payload)) {
            return response()->json([
                'success' => false,
                'message' => 'Signature Midtrans tidak valid.',
                'data' => null,
            ], 401);
        }

        $payment = Payment::query()->where('midtrans_order_id', $payload['order_id'] ?? '')->first();
        if (! $payment) {
            return response()->json([
                'success' => false,
                'message' => 'Payment tidak ditemukan.',
                'data' => null,
            ], 404);
        }

        $order = Order::query()->with('store.user.wallet', 'product')->find($payment->order_id);
        $transactionStatus = $payload['transaction_status'] ?? null;

        DB::transaction(function () use ($transactionStatus, $payment, $order, $payload) {
            if (in_array($transactionStatus, ['capture', 'settlement'], true)) {
                $payment->update([
                    'status' => 'paid',
                    'midtrans_transaction_id' => $payload['transaction_id'] ?? null,
                    'paid_at' => now(),
                ]);

                $order->update(['status' => 'dikonfirmasi']);
                $order->product?->update(['status' => 'sold']);
                $this->escrowService->holdFunds($order);
                return;
            }

            if (in_array($transactionStatus, ['expire', 'cancel', 'deny', 'failure'], true)) {
                $payment->update([
                    'status' => 'failed',
                    'midtrans_transaction_id' => $payload['transaction_id'] ?? null,
                ]);

                $order->update(['status' => 'dibatalkan']);
                $order->product?->update(['status' => 'active']);
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Webhook berhasil diproses.',
            'data' => null,
        ]);
    }
}
