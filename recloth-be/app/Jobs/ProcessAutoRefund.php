<?php

namespace App\Jobs;

use App\Models\Order;
use App\Models\WalletTransaction;
use App\Support\SystemConfigValue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;

class ProcessAutoRefund implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        $days = SystemConfigValue::int('auto_refund_days', 3);
        $deadline = now()->subDays($days);

        Order::query()
            ->where(function ($query) use ($deadline) {
                $query->where(function ($q) use ($deadline) {
                    $q->where('status', 'menunggu_bayar')->where('created_at', '<=', $deadline);
                })->orWhere(function ($q) use ($deadline) {
                    $q->where('status', 'dikonfirmasi')
                        ->whereNull('resi')
                        ->where('updated_at', '<=', $deadline);
                });
            })
            ->where('escrow_status', 'held')
            ->with('store.user.wallet')
            ->chunkById(100, function ($orders) {
                foreach ($orders as $order) {
                    DB::transaction(function () use ($order) {
                        $sellerWallet = $order->store?->user?->wallet;

                        if ($sellerWallet) {
                            $sellerWallet->refresh();
                            $sellerWallet->held_balance = max(0, $sellerWallet->held_balance - $order->total);
                            $sellerWallet->save();

                            WalletTransaction::query()->create([
                                'wallet_id' => $sellerWallet->id,
                                'order_id' => $order->id,
                                'type' => 'refund',
                                'amount' => $order->total,
                                'description' => 'Auto refund order #'.$order->id,
                            ]);
                        }

                        $order->update([
                            'status' => 'direfund',
                            'escrow_status' => 'refunded',
                        ]);
                    });
                }
            });
    }
}
