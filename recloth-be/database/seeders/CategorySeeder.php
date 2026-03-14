<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Atasan',
            'Bawahan',
            'Sepatu & Sandal',
            'Tas & Dompet',
            'Aksesoris',
            'Jaket & Outer',
            'Pakaian Formal',
            'Pakaian Tradisional',
        ];

        foreach ($categories as $index => $name) {
            Category::query()->updateOrCreate(
                ['slug' => Str::slug($name)],
                [
                    'name' => $name,
                    'status' => 'active',
                    'sort_order' => $index + 1,
                ]
            );
        }
    }
}
