<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        $today = now()->toDateString();

        $gmvToday = (float) Order::query()
            ->whereDate('created_at', $today)
            ->whereIn('status', ['dikonfirmasi', 'dikirim', 'selesai'])
            ->sum('total');

        $transactions = Order::query()->count();
        $activeUsers = \App\Models\User::query()->where('status', 'active')->count();
        $totalCommission = (float) Order::query()->sum('komisi');

        return [
            Stat::make('GMV Hari Ini', 'Rp '.number_format($gmvToday, 0, ',', '.')),
            Stat::make('Total Transaksi', (string) $transactions),
            Stat::make('User Aktif', (string) $activeUsers),
            Stat::make('Total Komisi', 'Rp '.number_format($totalCommission, 0, ',', '.')),
        ];
    }
}
