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
            'Jackets' => [
                'https://image.hm.com/assets/hm/ae/b2/aeb2414192d736d902e8ab6784c4abe38482ddbb.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/2e/8f/2e8fc6a52d8b3aa665e555c757c2feafa2abe345.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/55/49/5549d973d9aa5cd0d92239f94cacdf28448451be.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/3b/f6/3bf63bb1a33231a206ae02f382e85cb3712bd7fd.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/a2/aa/a2aa25afdcb784e618d3fce2bc446ca1a7e93a83.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/88/1c/881c0ca53f0a850a07fe77c15569d27791d6c34a.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/5b/15/5b159b2ba43b44d5733b7529daa0b39a2a3ac3ee.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/ab/dd/abdda9dbc0a65de4681076b6ae861624db27509c.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/b4/89/b489d976435367ae6bfec691f7b3ef718a9b303e.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/a3/9a/a39a99793d05f21332ac3b09b1a2f8f7f0a9b631.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/be/e4/bee441d20097d6b907e26ecb51e3b5be1dae5bcd.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/16/eb/16eb279d6908f3b52420579ffb4ec37baa53ed99.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/db/9a/db9a12ae1348450d2861681d5017b43b1e11c13a.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/4c/4a/4c4aaee6afdbc28535d63f2ed9764d1dfe43cf24.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/4f/f3/4ff3dad0dc0b88a6e641c2356615b66005a98b79.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/e2/01/e201a480264753d7db2d820938d7373dd4e27b13.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/58/87/58872cf9378d92f2944ef8debeaf6579ed542b27.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/fc/8d/fc8d30d7cf09ce6efd603512032a5b51bcd4e4d7.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/c9/ad/c9ad629e97432b2040eec17f9587010dcf551860.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/9c/86/9c862566c76040da3caa0f66cbf71f751e476aee.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/dc/f5/dcf575e395adc3c7ede77514a45d560ac95e5c64.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/9d/09/9d098e247e72f2f6c4bf217ed8062fd359b61259.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/cf/76/cf7608dbac9bf9e2c78613c0e69ac51219ff4101.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/fa/26/fa264b7dad10ccd1fe8994ba006cb577299e7690.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/ab/27/ab27040cbfb39ad5c0871f934d00d2ed20c81e66.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/55/46/5546f5cae5fe05646513638bfd49bbd59ccabbe4.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/3b/06/3b06c1b77ec7eec69fbc123df34d6311bcc256a4.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/51/53/5153400e5f85448e3be8ec9f9ad8b82223b6c900.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/84/b1/84b11e02d51c8c83b2b1edcc74aa834a662062f2.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/d9/75/d97562e78c63f376eae32df6e5994f731ea9c064.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/42/0c/420c23511cf6fcc53fd831d0542c99c3095a1167.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/8f/f9/8ff9962f367025d847b5500abb50e42e0bbd4b30.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/7f/d8/7fd8653af4e446c939c0f46d1ff12734d9a4179a.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/e8/35/e835b6fb6ad2c5845d817cd5841ce40746ba0134.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/bb/13/bb134dabc8f45c10d48823b64f8334f18c342eb0.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/7d/8c/7d8cabf48581e87c230cd54099d62a1e1dbbc3f2.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/8c/35/8c350630deb50b6fc290096a6db2304aaa758920.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/6a/6e/6a6e5ff5e8044bad15c7f96df706c617d85cc280.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/ff/4c/ff4c9f81f71532125c7e1e920209d3b8a4dc6570.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/55/10/551018f9c5864d999ad7bd1bbb5af069da90bc91.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/66/0e/660e7425c5be180b1429926c0c7a3746584c6403.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/28/91/28910e2b7acc194c45e6d4cfcec0e3b717baa56d.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/f4/19/f41955997873e0d5e5ec7ebdc5d2a8fc432713ca.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/94/51/94511f646fdc4a24777ac714ff60c3fca8245945.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/74/2c/742c0d7ee170343b58415f0ea8a7573994b861ec.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/7a/ff/7aff1d36a6b0bbceab613e5d4a898efaad0e81e4.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/e9/d4/e9d45bdf840cab51e3d97f06f013fdf6a5818d12.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/8f/48/8f48645ea82f84a1dd1ac308a408fde652758170.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/07/3e/073e3960574f5d0f408008c82663deb974a53eaa.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/5a/c7/5ac786c86823b6906b6385b0f4d56f1cadd0f29e.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/64/a0/64a0796eaf1574061647d5968c9b18faba0d49d1.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/96/78/967828ce8222ebe12e6681d8850b36a69c54b59c.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/b6/a6/b6a6bec866697da13840331ad1588919cb88f049.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/5d/65/5d65fa07b6182ea07432a8f5cfc9c3687e6f0bce.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/c5/4d/c54d3d4bd112c61202814a9b577c983ab7bcd5ab.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/96/d7/96d7fa4abdf2f94f3af9f7cfc4bb43c314cb41bf.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/7a/e5/7ae522982b43f47deced2658b7c86102ac37bdbd.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/ef/44/ef44482ee35bb624ec724924c7616f2cf930bc64.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/d5/cd/d5cd25c58821d9a49002bf325bc9bdb185bfb3da.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/19/ee/19ee48a9d17499e55e1997c0f8dea053216dacde.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/7d/88/7d88ab5f7520324fe105e81cfe323983beddd5c5.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/57/a4/57a4268217f39d83d76a23b23af158232be595d2.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/1b/32/1b32d2691fc1e9975931518fb881da2e7aba9b49.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/42/fa/42fa9fc7f559d47ecedefe3a2c7ec5ed46fcce85.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/d2/5d/d25dad9749170324a487a4e9626b0559743bd456.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/8f/e8/8fe8cc9def212b8ad44347479e4040d23cbf937b.jpg?imwidth=600',
                'https://image.hm.com/assets/hm/b3/47/b347a8c24827af446ebf7d4980a76894f63edb41.jpg?imwidth=600',
            ],
            'Default' => [
                'https://image.hm.com/assets/hm/ae/b2/aeb2414192d736d902e8ab6784c4abe38482ddbb.jpg?imwidth=600'
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

                // Add 1-2 photos from our new high-quality H&M list
                $urls = $stableUrls['Jackets'];
                
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
