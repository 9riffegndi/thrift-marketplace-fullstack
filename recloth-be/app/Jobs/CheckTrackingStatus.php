<?php

namespace App\Jobs;

use App\Models\Order;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class CheckTrackingStatus implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        $trackedOrders = Order::query()
            ->where('status', 'dikirim')
            ->whereNotNull('resi')
            ->whereNotNull('courier_code')
            ->count();

        Log::info('CheckTrackingStatus executed', [
            'tracked_orders' => $trackedOrders,
            'executed_at' => now()->toDateTimeString(),
        ]);
    }
}
