<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductPhoto;
use App\Models\Store;
use App\Models\StoreCourier;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all();
        $stores = Store::all();
        $couriers = ['jne', 'jnt', 'sicepat', 'pos', 'ninja'];
        $conditions = ['A', 'B', 'B', 'C', 'C', 'D'];
        $sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

        $productNames = [
            'Kemeja Flannel Vintage', 'Kaos Polos Premium', 'Celana Jeans Skinny',
            'Jaket Denim Wash', 'Dress Floral Vintage', 'Blouse Katun Polos',
            'Rok Mini Plaid', 'Sweater Oversize Cozy', 'Hoodie Fleece Warm',
            'Kemeja Batik Modern', 'Celana Chino Slim', 'Blazer Formal Vintage',
            'Cardigan Rajut Tebal', 'T-shirt Graphic Print', 'Kulot Linen Premium',
            'Kemeja Oxford Button Down', 'Celana Cargo Utility', 'Dress Midi Stripe',
            'Jaket Bomber Vintage', 'Vest Denim Patchwork', 'Kemeja Hawaii Retro',
            'Kaos Crop Top Y2K', 'Celana Palazzo Wide', 'Coat Wool Minimalis',
            'Jumpsuit Casual Chic', 'Kemeja Linen Santai', 'Celana Pendek Chino',
            'Top Knit Ribbed', 'Jaket Parasut Outdoor', 'Dress Wrap Elegant',
            'Kemeja Kotak-kotak Flannel', 'Kaos Polo Colorblock', 'Celana Belel Ripped',
            'Varsity Jacket Baseball', 'Blouse Puff Sleeve Retro', 'Rok Brokat Pesta',
            'Sweater Turtleneck', 'Hoodie Zip Up Branded', 'Kemeja Denim Chambray',
            'Legging High Waist', 'Blazer Cropped Structured', 'Kemeja Korean Style',
            'Celana Jeans Boyfriend', 'Tank Top Ribbed Basic', 'Jacket Kulit Sintetis',
            'Dress Kaftan Batik', 'Kemeja Polos Oversized', 'Celana Jogger Couple',
            'Blouse Off Shoulder', 'Cardigan Panjang Boho',
        ];

        // Setup store couriers
        foreach ($stores as $store) {
            $selectedCouriers = array_slice($couriers, 0, rand(2, 4));
            foreach ($selectedCouriers as $courier) {
                StoreCourier::firstOrCreate([
                    'store_id'     => $store->id,
                    'courier_code' => $courier,
                ]);
            }
        }

        // Create exactly 10 products for the first store
        $store = Store::first();
        if ($store) {
            for ($i = 1; $i <= 10; $i++) {
                $nameBase = $productNames[array_rand($productNames)];
                $category = $categories->random();
                $condition = $conditions[array_rand($conditions)];
                $size = $sizes[array_rand($sizes)];
                $price = rand(15, 800) * 1000;
                $status = rand(0, 9) < 9 ? 'active' : 'sold';

                $name = $nameBase . ' ' . $condition . ' (' . Str::random(3) . ')';
                $slug = Str::slug($name) . '-' . $store->id . '-' . $i;

                $product = Product::create([
                    'store_id'    => $store->id,
                    'category_id' => $category->id,
                    'name'        => $name,
                    'slug'        => $slug,
                    'description' => "Produk pilihan dari {$store->name}. Kondisi {$condition}. Masih sangat layak pakai, material premium.",
                    'condition'   => $condition,
                    'price'       => $price,
                    'size'        => $size,
                    'weight'      => rand(150, 1500),
                    'status'      => $status,
                ]);

                // Add 1 photo per product for efficiency
                ProductPhoto::create([
                    'product_id' => $product->id,
                    'photo_url'  => "https://picsum.photos/seed/prod_{$i}/800/800",
                    'is_primary' => true,
                    'sort_order' => 0,
                ]);
            }
        }

        $total = Product::count();
        $this->command->info("✅ {$total} products created");
    }
}
