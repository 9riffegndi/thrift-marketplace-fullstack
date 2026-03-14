<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Support\SystemConfigValue;
use Illuminate\Support\Facades\DB;

class EscrowService
{
    public function holdFunds(Order $order): void
    {
        DB::transaction(function () use ($order) {
            $wallet = Wallet::query()
                ->where('user_id', $order->store?->user_id)
                ->lockForUpdate()
                ->first();

            if (! $wallet) {
                return;
            }

            $wallet->held_balance += $order->total;
            $wallet->save();

            WalletTransaction::query()->create([
                'wallet_id' => $wallet->id,
                'order_id' => $order->id,
                'type' => 'escrow_in',
                'amount' => $order->total,
                'description' => 'Escrow hold dana order #'.$order->id,
            ]);

            $order->update(['escrow_status' => 'held']);
        });
    }

    public function releaseFunds(Order $order): void
    {
        DB::transaction(function () use ($order) {
            $wallet = $order->store?->user?->wallet;
            if (! $wallet) {
                return;
            }

            $commissionPercent = SystemConfigValue::float('platform_commission_percent', 5);
            $commission = round($order->total * ($commissionPercent / 100), 2);
            $netAmount = max(0, $order->total - $commission);

            $wallet->refresh();
            $wallet->held_balance = max(0, $wallet->held_balance - $order->total);
            $wallet->balance += $netAmount;
            $wallet->save();

            WalletTransaction::query()->create([
                'wallet_id' => $wallet->id,
                'order_id' => $order->id,
                'type' => 'escrow_release',
                'amount' => $netAmount,
                'description' => 'Escrow release order #'.$order->id,
            ]);

            WalletTransaction::query()->create([
                'wallet_id' => $wallet->id,
                'order_id' => $order->id,
                'type' => 'commission',
                'amount' => $commission,
                'description' => 'Komisi platform order #'.$order->id,
            ]);

            $order->update([
                'komisi' => $commission,
                'escrow_status' => 'released',
            ]);
        });
    }

    public function refundFunds(Order $order): void
    {
        DB::transaction(function () use ($order) {
            $wallet = $order->store?->user?->wallet;
            if (! $wallet) {
                return;
            }

            $wallet->refresh();
            $wallet->held_balance = max(0, $wallet->held_balance - $order->total);
            $wallet->save();

            WalletTransaction::query()->create([
                'wallet_id' => $wallet->id,
                'order_id' => $order->id,
                'type' => 'refund',
                'amount' => $order->total,
                'description' => 'Refund escrow order #'.$order->id,
            ]);

            $order->update(['escrow_status' => 'refunded']);
        });
    }
}
