<?php

namespace Database\Seeders;

use App\Models\SystemConfig;
use Illuminate\Database\Seeder;

class SystemConfigSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            'platform_commission_percent' => ['5', 'Komisi platform per transaksi'],
            'auto_refund_days' => ['3', 'Batas hari refund otomatis'],
            'auto_complete_days' => ['3', 'Batas hari auto complete'],
            'auto_suspend_rating' => ['2.0', 'Batas rating auto suspend'],
            'auto_suspend_reports' => ['3', 'Batas laporan auto suspend'],
            'min_withdrawal_amount' => ['50000', 'Nominal minimum withdrawal'],
        ];

        foreach ($defaults as $key => [$value, $description]) {
            SystemConfig::query()->updateOrCreate(
                ['key' => $key],
                ['value' => $value, 'description' => $description, 'updated_at' => now()]
            );
        }
    }
}
