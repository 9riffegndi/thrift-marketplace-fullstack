<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;

class TransactionsLineChart extends ChartWidget
{
    protected ?string $heading = 'Transaksi 30 Hari Terakhir';

    protected function getData(): array
    {
        $labels = [];
        $data = [];

        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $labels[] = $date->format('d M');
            $data[] = Order::query()->whereDate('created_at', $date)->count();
        }

        return [
            'datasets' => [[
                'label' => 'Jumlah Transaksi',
                'data' => $data,
            ]],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
