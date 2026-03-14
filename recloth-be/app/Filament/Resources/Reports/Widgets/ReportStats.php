<?php

namespace App\Filament\Resources\Reports\Widgets;

use App\Models\Order;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ReportStats extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        $gmv = (float) Order::query()->whereIn('status', ['dikonfirmasi', 'dikirim', 'selesai'])->sum('total');
        $commission = (float) Order::query()->sum('komisi');

        return [
            Stat::make('Total GMV', 'Rp '.number_format($gmv, 0, ',', '.')),
            Stat::make('Total Komisi', 'Rp '.number_format($commission, 0, ',', '.')),
        ];
    }
}
