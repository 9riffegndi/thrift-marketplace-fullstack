<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductPhoto;
use App\Models\Store;
use App\Models\User;
use App\Models\Wallet;
use App\Models\Banner;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class RealisticIndoMarketplaceSeeder extends Seeder
{
    public function run(): void
    {
        $role = Role::firstOrCreate(['name' => 'user', 'guard_name' => 'web']);

        $maleNames = [
            'Aditya Pratama', 'Budi Santoso', 'Rizky Ramadhan', 'Dimas Saputra', 'Farhan Maulana',
            'Agus Wijaya', 'Hendra Kurniawan', 'Eko Prasetyo', 'Bambang Hermawan', 'Andi Setiawan',
            'Deni Ramdani', 'Asep Sunandar', 'Iwan Fals', 'Taufik Hidayat', 'Gading Marten'
        ];

        $femaleNames = [
            'Siti Aminah', 'Putri Lestari', 'Anisa Rahmawati', 'Indah Permata', 'Devi Safitri',
            'Rina Kartika', 'Maya Sari', 'Dian Sastrowardoyo', 'Laudya Cynthia Bella', 'Raisa Andriana',
            'Isyana Sarasvati', 'Maudy Ayunda', 'Chelsea Islan', 'Pevita Pearce', 'Luna Maya'
        ];

        $cities = ['Jakarta Selatan', 'Bandung', 'Surabaya', 'Yogyakarta', 'Medan', 'Semarang', 'Makassar', 'Denpasar', 'Bogor', 'Bekasi'];
        $provinces = ['DKI Jakarta', 'Jawa Barat', 'Jawa Timur', 'DI Yogyakarta', 'Sumatera Utara', 'Jawa Tengah', 'Sulawesi Selatan', 'Bali', 'Jawa Barat', 'Jawa Barat'];

        $storeNames = [
            'Preloved Kita', 'Gaya Baru Thrifting', 'Lemari Ratih', 'Second Choice ID', 'Pakaian Bekas Premium',
            'Galeri Vintage', 'Toko Baju Serba Ada', 'Kedai Outfit', 'Ruang Gaya', 'Sandang Lestari',
            'Busana Abadi', 'Koleksi Pribadi', 'Pasar Thrifting', 'Pojok Pakaian', 'Sentra Baju'
        ];

        $productData = [
            'Atasan' => [
                ['name' => 'Kemeja Flannel H&M', 'brands' => ['H&M', 'Uniqlo', 'Zara']],
                ['name' => 'Kaos Polos Premium', 'brands' => ['Uniqlo', 'Giordano', 'Basic']],
                ['name' => 'Blouse Floral Vintage', 'brands' => ['Zara', 'Mango', 'Stradivarius']],
                ['name' => 'T-shirt Oversize', 'brands' => ['H&M', 'Pull&Bear', 'Bershka']],
                ['name' => 'Kemeja Linen Santai', 'brands' => ['Uniqlo', 'Muji', 'Linen Co']],
            ],
            'Bawahan' => [
                ['name' => 'Celana Jeans Skinny', 'brands' => ['Levi\'s', 'Wrangler', 'Lee']],
                ['name' => 'Celana Chino Slim Fit', 'brands' => ['Uniqlo', 'Dockers', 'H&M']],
                ['name' => 'Rok Plisket Premium', 'brands' => ['Local Brand', 'Hijup', 'Vanilla']],
                ['name' => 'Hotpants Denim', 'brands' => ['Pull&Bear', 'Bershka', 'H&M']],
                ['name' => 'Celana Cargo Utility', 'brands' => ['Eiger', 'Consina', 'The North Face']],
            ],
            'Jaket & Outer' => [
                ['name' => 'Hoodie Fleece Warm', 'brands' => ['Champion', 'H&M', 'Nike']],
                ['name' => 'Jaket Denim Wash', 'brands' => ['Levi\'s', 'Vintage', 'Gap']],
                ['name' => 'Bomber Jacket Retro', 'brands' => ['Alpha Industries', 'Zara', 'H&M']],
                ['name' => 'Cardigan Rajut Tebal', 'brands' => ['Uniqlo', 'Gu', 'Japanese Brand']],
                ['name' => 'Jaket Windbreaker', 'brands' => ['Nike', 'Adidas', 'Reebok']],
            ],
            'Sepatu & Sandal' => [
                ['name' => 'Sneakers Classic', 'brands' => ['Adidas Stan Smith', 'Nike Air Force 1', 'Vans Old Skool']],
                ['name' => 'Sandal Birki Style', 'brands' => ['Birkenstock', 'Local Brand', 'Kyros']],
            ]
        ];

        $unsplashIds = [
            'Atasan' => [
                '3V8xo5Gbusk', 'elbKS4DY21g', '7rNmwV2dKwA', 'uXn4yP_2gR0', '25M6_cmjEIs', 
                'm6wVEhf8W2M', '18i85V5uXhA', '0x9y1jW5x0c', 'T6a4h3qA88', 'w2V_V7k5zV0'
            ],
            'Bawahan' => [
                'zDyJOj8ZXG0', 'VBf7RPTezEc', 'RWLTHuxCqYo', '8ogoafT2s8o', 'Xy94_bPTm5s', 
                'q_LqU8390bU', 'Qk4n4Jm0-hA', 'e616t17v50E', 'K_X18MvD_hS', 'aQ0Cz__AHET'
            ],
            'Jaket & Outer' => [
                'sO3TXDcleTI', 'pSsOJ5pheII', 'tOPINlolvX4', 'yzFsvhltZj0', '1stfO72rayc', 
                'TCvB_p-WMiU', '0Cz--AOHETw', 'g0BILldZuyI', 'Qk4n4Jm0-hA', 'Xk603x6k3cQ'
            ],
            'Sepatu & Sandal' => [
                'P5yW6_nN06k', '4S8rVqXv22A', 'q_LqU8390bU', 'p4D51z8M87A', 'c5164B86-Yk', 
                'x6b-VvY57zQ', 'z196l42m-1M', 'NO-nJu64o_Y', '164_6wVEhf8', '_99r8905p0'
            ],
            'Default' => ['elbKS4DY21g']
        ];

        $categories = Category::all();

        // Create 20 Users + Stores
        for ($i = 0; $i < 20; $i++) {
            $isMale = rand(0, 1);
            $name = $isMale ? $maleNames[array_rand($maleNames)] : $femaleNames[array_rand($femaleNames)];
            $email = strtolower(str_replace(' ', '.', $name)) . rand(10, 99) . '@gmail.com';
            
            $user = User::create([
                'name'     => $name,
                'email'    => $email,
                'password' => Hash::make('password'),
                'phone'    => '08' . rand(111111111, 999999999),
                'avatar'   => 'https://i.pravatar.cc/150?u=' . $email,
                'status'   => 'active',
            ]);

            $user->assignRole($role);
            Wallet::create(['user_id' => $user->id, 'balance' => rand(500, 5000) * 1000, 'held_balance' => 0]);

            $cityIndex = array_rand($cities);
            $storeName = $storeNames[array_rand($storeNames)] . ' ' . rand(1, 100);

            $store = Store::create([
                'user_id'     => $user->id,
                'name'        => $storeName,
                'slug'        => Str::slug($storeName),
                'description' => "Halo! Kami menjual koleksi pakaian preloved {$name} yang terawat dan berkualitas. Silakan cek katalog kami.",
                'photo'       => "https://picsum.photos/seed/store_{$i}/400/400",
                'city'        => $cities[$cityIndex],
                'province'    => $provinces[$cityIndex],
                'address'     => "Jl. Pahlawan No. " . rand(1, 200) . ", " . $cities[$cityIndex],
                'rating'      => number_format(4 + (rand(0, 10) / 10), 1),
                'total_sales' => rand(10, 500),
                'status'      => 'active',
            ]);

            $store->couriers()->createMany([
                ['courier_code' => 'jne'],
                ['courier_code' => 'jnt'],
                ['courier_code' => 'sicepat'],
            ]);

            // Create 5-10 products per store
            $numProducts = rand(5, 10);
            for ($j = 0; $j < $numProducts; $j++) {
                $category = $categories->random();
                $catName = $category->name;
                
                // Fallback for categories not in productData
                $lookupKey = isset($productData[$catName]) ? $catName : 'Atasan';
                $pInfo = $productData[$lookupKey][array_rand($productData[$lookupKey])];
                $brand = $pInfo['brands'][array_rand($pInfo['brands'])];
                
                $finalName = "{$pInfo['name']} {$brand} " . rand(1, 99);
                $condition = ['A', 'A', 'B', 'B', 'C'][rand(0, 4)];
                $price = rand(50, 1500) * 1000;
                
                $product = Product::create([
                    'store_id'    => $store->id,
                    'category_id' => $category->id,
                    'name'        => $finalName,
                    'slug'        => Str::slug($finalName) . '-' . Str::random(5),
                    'description' => "Barang preloved berkualitas. Kondisi {$condition}, jarang dipakai. Original {$brand}. Material sangat nyaman.",
                    'condition'   => $condition,
                    'price'       => $price,
                    'size'        => ['S', 'M', 'L', 'XL', 'All Size'][rand(0, 4)],
                    'weight'      => rand(200, 1500),
                    'status'      => 'active',
                ]);

                // Add 1-2 photos
                $photoKey = isset($unsplashIds[$lookupKey]) ? $lookupKey : 'Default';
                $ids = $unsplashIds[$photoKey];
                
                for ($k = 0; $k < 1; $k++) {
                    $uId = $ids[array_rand($ids)];
                    ProductPhoto::create([
                        'product_id' => $product->id,
                        'photo_url'  => "https://images.unsplash.com/photo-{$uId}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                        'is_primary' => $k === 0,
                        'sort_order' => $k,
                    ]);
                }
            }
        }

        // Create Banners
        $banners = [
            [
                'title' => 'Koleksi Vintage Terkurasi',
                'image_url' => 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1600&q=80',
                'link_url' => '/cari?category=akseseoris',
            ],
            [
                'title' => 'Upgrade Gaya Berkelanjutan',
                'image_url' => 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1600&q=80',
                'link_url' => '/cari?category=atasan',
            ],
            [
                'title' => 'Thrifting Casual Premium',
                'image_url' => 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=1600&q=80',
                'link_url' => '/cari?category=jaket-outer',
            ]
        ];

        foreach ($banners as $index => $b) {
            Banner::create([
                'title' => $b['title'],
                'image_url' => $b['image_url'],
                'link_url' => $b['link_url'],
                'sort_order' => $index + 1,
                'status' => 'active',
            ]);
        }
    }
}
