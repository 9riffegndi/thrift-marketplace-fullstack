<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class MarketplaceDummySeeder extends Seeder
{
    public function run(): void
    {
        Role::findOrCreate('user', 'web');

        $categories = Category::query()->where('status', 'active')->get();

        if ($categories->isEmpty()) {
            return;
        }

        $sellers = [
            [
                'name' => 'Nadia Wardrobe',
                'email' => 'seller1@recloth.id',
                'phone' => '081111111111',
                'city' => 'Jakarta Selatan',
                'province' => 'DKI Jakarta',
                'store' => 'Nadia Preloved Studio',
                'avatar' => 'https://i.pravatar.cc/300?img=11',
                'store_photo' => 'https://picsum.photos/seed/store-nadia/800/800',
                'description' => 'Kurasi preloved wanita premium, bersih, dan siap pakai.',
            ],
            [
                'name' => 'Raka Outfit',
                'email' => 'seller2@recloth.id',
                'phone' => '082222222222',
                'city' => 'Bandung',
                'province' => 'Jawa Barat',
                'store' => 'Raka Daily Wear',
                'avatar' => 'https://i.pravatar.cc/300?img=22',
                'store_photo' => 'https://picsum.photos/seed/store-raka/800/800',
                'description' => 'Fokus outfit casual pria dan unisex harga bersahabat.',
            ],
            [
                'name' => 'Maya Vintage',
                'email' => 'seller3@recloth.id',
                'phone' => '083333333333',
                'city' => 'Surabaya',
                'province' => 'Jawa Timur',
                'store' => 'Maya Vintage Corner',
                'avatar' => 'https://i.pravatar.cc/300?img=33',
                'store_photo' => 'https://picsum.photos/seed/store-maya/800/800',
                'description' => 'Pilihan vintage item terkurasi untuk daily look unik.',
            ],
        ];

        $namePrefixes = [
            'Oversize Shirt',
            'Pleated Skirt',
            'Canvas Tote Bag',
            'Denim Jacket',
            'Sneakers Classic',
            'Linen Pants',
            'Knit Cardigan',
            'Formal Blazer',
        ];

        $conditions = ['A', 'B', 'C'];
        $sizes = ['XS', 'S', 'M', 'L', 'XL', 'All Size'];

        foreach ($sellers as $sellerIndex => $sellerData) {
            $user = User::query()->updateOrCreate(
                ['email' => $sellerData['email']],
                [
                    'name' => $sellerData['name'],
                    'phone' => $sellerData['phone'],
                    'avatar' => $sellerData['avatar'],
                    'role' => 'user',
                    'status' => 'active',
                    'password' => Hash::make('password'),
                ]
            );

            $user->syncRoles(['user']);

            Wallet::query()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'balance' => random_int(120000, 650000),
                    'held_balance' => random_int(10000, 90000),
                ]
            );

            $store = Store::query()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'name' => $sellerData['store'],
                    'slug' => Str::slug($sellerData['store']).'-demo',
                    'description' => $sellerData['description'],
                    'photo' => $sellerData['store_photo'],
                    'city' => $sellerData['city'],
                    'province' => $sellerData['province'],
                    'address' => 'Jl. Demo No. '.($sellerIndex + 10).', '.$sellerData['city'],
                    'rating' => number_format(mt_rand(42, 50) / 10, 2, '.', ''),
                    'total_sales' => random_int(25, 180),
                    'status' => 'active',
                ]
            );

            $store->couriers()->delete();
            foreach (['jne', 'jnt', 'sicepat'] as $courier) {
                $store->couriers()->create(['courier_code' => $courier]);
            }

            foreach (range(1, 6) as $productNumber) {
                $category = $categories->random();
                $name = $namePrefixes[array_rand($namePrefixes)].' '.($sellerIndex + 1).'-'.$productNumber;

                $product = Product::query()->updateOrCreate(
                    ['slug' => Str::slug($name).'-demo'],
                    [
                        'store_id' => $store->id,
                        'category_id' => $category->id,
                        'name' => $name,
                        'description' => 'Produk preloved kondisi terawat. Tidak ada sobek, siap kirim di hari yang sama.',
                        'condition' => $conditions[array_rand($conditions)],
                        'price' => random_int(65000, 450000),
                        'size' => $sizes[array_rand($sizes)],
                        'weight' => random_int(250, 1200),
                        'status' => 'active',
                    ]
                );

                $product->photos()->delete();

                foreach (range(1, 3) as $photoOrder) {
                    $seed = Str::slug($product->slug.'-'.$photoOrder);
                    $product->photos()->create([
                        'photo_url' => 'https://picsum.photos/seed/'.$seed.'/900/1200',
                        'is_primary' => $photoOrder === 1,
                        'sort_order' => $photoOrder,
                    ]);
                }
            }
        }
    }
}
