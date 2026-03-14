<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $role = Role::firstOrCreate(['name' => 'user', 'guard_name' => 'web']);

        $cities = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Medan', 'Semarang', 'Makassar', 'Bali', 'Bogor', 'Bekasi'];
        $provinces = ['DKI Jakarta', 'Jawa Barat', 'Jawa Timur', 'DI Yogyakarta', 'Sumatera Utara', 'Jawa Tengah', 'Sulawesi Selatan', 'Bali', 'Jawa Barat', 'Jawa Barat'];
        
        // Specific Sample Users
        $samples = [
            [
                'name' => 'Sample Penjual',
                'email' => 'penjual@recloth.id',
                'store_name' => 'Toko Sampel Produk',
            ],
            [
                'name' => 'Sample Pembeli',
                'email' => 'pembeli@recloth.id',
                'store_name' => 'Koleksi Pribadi Kita',
            ]
        ];

        foreach ($samples as $index => $s) {
            $user = User::create([
                'name'     => $s['name'],
                'email'    => $s['email'],
                'password' => Hash::make('password'),
                'phone'    => '08' . str_pad($index + 100, 9, '0', STR_PAD_LEFT),
                'avatar'   => "https://i.pravatar.cc/150?u=" . $s['email'],
                'status'   => 'active',
            ]);

            $user->assignRole($role);
            Wallet::create(['user_id' => $user->id, 'balance' => 1000000, 'held_balance' => 0]);

            Store::create([
                'user_id'     => $user->id,
                'name'        => $s['store_name'],
                'slug'        => \Illuminate\Support\Str::slug($s['store_name']),
                'description' => "Toko sampel untuk keperluan QA dan testing. Menyediakan berbagai barang prelove.",
                'photo'       => "https://picsum.photos/seed/sample" . $index . "/400/400",
                'city'        => 'Jakarta',
                'province'    => 'DKI Jakarta',
                'address'     => 'Sudirman Central Business District (SCBD), Jakarta',
                'rating'      => 4.8,
                'total_sales' => rand(50, 100),
                'status'      => 'active',
            ]);
        }

        $this->command->info('✅ Sample users + stores created');
    }
}
