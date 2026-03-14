<?php

namespace App\Jobs;

use App\Models\Report;
use App\Models\Store;
use App\Models\User;
use App\Support\SystemConfigValue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessAutoSuspend implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        $ratingThreshold = SystemConfigValue::float('auto_suspend_rating', 2.0);
        $reportThreshold = SystemConfigValue::int('auto_suspend_reports', 3);

        Store::query()
            ->where('status', '!=', 'suspended')
            ->where('rating', '<', $ratingThreshold)
            ->with(['user:id,status', 'products:id,store_id,status'])
            ->chunkById(100, function ($stores) {
                foreach ($stores as $store) {
                    $store->update(['status' => 'suspended']);
                    $store->products()->update(['status' => 'suspended']);
                    $store->user?->update(['status' => 'suspended']);
                }
            });

        Report::query()
            ->selectRaw('reported_user_id, COUNT(*) as total_reports')
            ->whereIn('status', ['pending', 'reviewed'])
            ->groupBy('reported_user_id')
            ->havingRaw('COUNT(*) >= ?', [$reportThreshold])
            ->pluck('reported_user_id')
            ->chunk(100)
            ->each(function ($userIds) {
                User::query()->whereIn('id', $userIds)->update(['status' => 'suspended']);

                Store::query()->whereIn('user_id', $userIds)->each(function (Store $store) {
                    $store->update(['status' => 'suspended']);
                    $store->products()->update(['status' => 'suspended']);
                });
            });
    }
}
