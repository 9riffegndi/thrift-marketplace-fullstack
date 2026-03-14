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

        $stableUrls = [
            'Atasan' => [
                'https://lp2.hm.com/hmgoepprod?set=source[/01/0d/010d7a040b0797170881f215d862f1e62688b13c.jpg],origin[dam],category[],type[LOOKBOOK],res[z],hmver[1]&call=url[file:/product/main]',
                'https://lp2.hm.com/hmgoepprod?set=source[/6e/bc/6ebca6a7f53f9361ad22f03328e75e9f193d5f8a.jpg],origin[dam],category[],type[LOOKBOOK],res[z],hmver[1]&call=url[file:/product/main]',
                'https://lp2.hm.com/hmgoepprod?set=source[/3b/c3/3bc3b3921319c5c76c120c9f168fbc97cd645f09.jpg],origin[dam],category[],type[LOOKBOOK],res[z],hmver[1]&call=url[file:/product/main]',
                'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1591047116407-37a5223a7599?q=80&w=1000&auto=format&fit=crop',
            ],
            'Bawahan' => [
                'https://lp2.hm.com/hmgoepprod?set=source[/1f/6d/1f6d34b4c107198d098e7987ca9991206f47f201.jpg],origin[dam],category[],type[LOOKBOOK],res[z],hmver[1]&call=url[file:/product/main]',
                'https://lp2.hm.com/hmgoepprod?set=source[/7f/0b/7f0b83e028b8b9cb030f0f375f928a7e0c406085.jpg],origin[dam],category[],type[LOOKBOOK],res[z],hmver[1]&call=url[file:/product/main]',
                'https://lp2.hm.com/hmgoepprod?set=source[/95/a0/95a07106eea410410800660a9991206f47f201.jpg],origin[dam],category[],type[LOOKBOOK],res[z],hmver[1]&call=url[file:/product/main]',
                'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1542272604-787a3e553584?q=80&w=1000&auto=format&fit=crop',
            ],
            'Jaket & Outer' => [
                'https://lp2.hm.com/hmgoepprod?set=source[/2f/8c/2f8c5b9619a9a0e67b7e5f6e8976a44c9b9cb1a4.jpg],origin[dam],category[],type[LOOKBOOK],res[z],hmver[1]&call=url[file:/product/main]',
                'https://lp2.hm.com/hmgoepprod?set=source[/4a/a0/4aa068b5a1a1f0a1c6e6a1e1e1e1e1e1e1e1e1e1.jpg],origin[dam],category[],type[LOOKBOOK],res[z],hmver[1]&call=url[file:/product/main]',
                'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1000&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1520975954732-383b5c39c158?q=80&w=1000&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1544022613-e87dc75a783a?q=80&w=1000&auto=format&fit=crop',
            ],
            'Sepatu & Sandal' => [
                'https://lp2.hm.com/hmgoepprod?set=source[/15/8e/158e235a9688df2cb6636ac5964893444053644f.jpg],origin[dam],category[],type[LOOKBOOK],res[z],hmver[1]&call=url[file:/product/main]',
                'https://lp2.hm.com/hmgoepprod?set=source[/d8/bf/d8bf84b8d5d4c8a5f8a07c3f7d1b8fa8d7a18f8c.jpg],origin[dam],category[],type[LOOKBOOK],res[z],hmver[1]&call=url[file:/product/main]',
                'https://images.unsplash.com/photo-1542291008-57ac454403fa?q=80&w=1000&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1460353081330-61928258325a?q=80&w=1000&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop',
            ],
            'Default' => [
                'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop'
            ]
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
                $photoKey = isset($stableUrls[$lookupKey]) ? $lookupKey : 'Default';
                $urls = $stableUrls[$photoKey];
                
                ProductPhoto::create([
                    'product_id' => $product->id,
                    'photo_url'  => $urls[array_rand($urls)],
                    'is_primary' => true,
                    'sort_order' => 0,
                ]);
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
