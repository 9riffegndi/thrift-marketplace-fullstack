<?php

namespace App\Jobs;

use App\Models\Order;
use App\Models\WalletTransaction;
use App\Support\SystemConfigValue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;

class ProcessAutoComplete implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        $days = SystemConfigValue::int('auto_complete_days', 3);
        $commissionPercent = SystemConfigValue::float('platform_commission_percent', 5);
        $deadline = now()->subDays($days);

        Order::query()
            ->where('status', 'dikirim')
            ->where('escrow_status', 'held')
            ->where('updated_at', '<=', $deadline)
            ->with('store.user.wallet')
            ->chunkById(100, function ($orders) use ($commissionPercent) {
                foreach ($orders as $order) {
                    DB::transaction(function () use ($order, $commissionPercent) {
                        $wallet = $order->store?->user?->wallet;
                        if (! $wallet) {
                            return;
                        }

                        $wallet->refresh();
                        $commission = round($order->total * ($commissionPercent / 100), 2);
                        $released = max(0, $order->total - $commission);

                        $wallet->held_balance = max(0, $wallet->held_balance - $order->total);
                        $wallet->balance += $released;
                        $wallet->save();

                        WalletTransaction::query()->create([
                            'wallet_id' => $wallet->id,
                            'order_id' => $order->id,
                            'type' => 'escrow_release',
                            'amount' => $released,
                            'description' => 'Auto complete release order #'.$order->id,
                        ]);

                        WalletTransaction::query()->create([
                            'wallet_id' => $wallet->id,
                            'order_id' => $order->id,
                            'type' => 'commission',
                            'amount' => $commission,
                            'description' => 'Platform commission order #'.$order->id,
                        ]);

                        $order->update([
                            'status' => 'selesai',
                            'escrow_status' => 'released',
                            'komisi' => $commission,
                        ]);
                    });
                }
            });
    }
}
