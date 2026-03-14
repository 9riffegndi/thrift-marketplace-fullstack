<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            SuperAdminSeeder::class,
            CategorySeeder::class,
            SystemConfigSeeder::class,
            UserSeeder::class, // Keep core sample users
            RealisticIndoMarketplaceSeeder::class,
            // ProductSeeder::class, // Optional, can be disabled if realistic seeder is enough
            // OrderSeeder::class,
        ]);
    }
}
