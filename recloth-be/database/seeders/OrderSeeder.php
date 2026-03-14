<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Review;
use App\Models\Store;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $buyers = User::inRandomOrder()->take(15)->get();
        $products = Product::with('store')->where('status', '!=', 'inactive')->inRandomOrder()->take(60)->get();

        $statuses = ['selesai', 'selesai', 'selesai', 'dikirim', 'dikonfirmasi', 'menunggu_bayar', 'dibatalkan', 'direfund'];
        $methods = ['qris', 'va_bca', 'va_mandiri', 'gopay', 'ovo'];
        $couriers = ['jne', 'jnt', 'sicepat'];

        $orderCount = 0;

        foreach ($products->take(50) as $product) {
            if ($product->store->user_id === null) continue;

            $buyer = $buyers->where('id', '!=', $product->store->user_id)->random();
            $status = $statuses[array_rand($statuses)];

            $subtotal = $product->price;
            $ongkir = rand(8, 35) * 1000;
            $diskon = rand(0, 3) > 0 ? 0 : rand(5, 50) * 1000;
            $total = max(0, $subtotal + $ongkir - $diskon);

            $order = Order::create([
                'buyer_id'       => $buyer->id,
                'store_id'       => $product->store_id,
                'product_id'     => $product->id,
                'type'           => 'buy',
                'status'         => $status,
                'subtotal'       => $subtotal,
                'ongkir'         => $ongkir,
                'diskon'         => $diskon,
                'komisi'         => $status === 'selesai' ? round($subtotal * 0.05) : 0,
                'total'          => $total,
                'courier_code'   => $couriers[array_rand($couriers)],
                'courier_service' => 'REG',
                'resi'           => in_array($status, ['dikirim', 'selesai']) ? strtoupper(Str::random(12)) : null,
                'escrow_status'  => $status === 'selesai' ? 'released' : ($status === 'direfund' ? 'refunded' : 'held'),
                'created_at'     => now()->subDays(rand(1, 90)),
            ]);

            Payment::create([
                'order_id'               => $order->id,
                'method'                 => $methods[array_rand($methods)],
                'midtrans_order_id'      => 'RECLOTH-' . $order->id . '-' . time(),
                'midtrans_transaction_id' => Str::uuid(),
                'amount'                 => $total,
                'status'                 => in_array($status, ['menunggu_bayar', 'dibatalkan']) ? 'pending' : 'paid',
                'paid_at'                => in_array($status, ['menunggu_bayar', 'dibatalkan']) ? null : $order->created_at->addHours(1),
            ]);

            // Wallet transaction untuk order selesai
            if ($status === 'selesai') {
                $sellerWallet = Wallet::where('user_id', $product->store->user_id)->first();
                if ($sellerWallet) {
                    $net = $subtotal - round($subtotal * 0.05);
                    $sellerWallet->increment('balance', $net);
                    WalletTransaction::create([
                        'wallet_id'   => $sellerWallet->id,
                        'order_id'    => $order->id,
                        'type'        => 'escrow_release',
                        'amount'      => $net,
                        'description' => 'Dana escrow dirilis untuk order #' . $order->id,
                        'created_at'  => $order->created_at->addDays(3),
                    ]);
                }

                // Add review for completed orders (70% chance)
                if (rand(0, 9) < 7) {
                    $comments = [
                        'Barang sesuai deskripsi, kondisi bagus!',
                        'Penjual ramah, pengiriman cepat. Recommended!',
                        'Kualitas oke, puas belanja di sini.',
                        'Barang sampai dengan aman, sesuai ekspektasi.',
                        'Mantap, kondisi lebih bagus dari foto. Thanks!',
                        'Seller responsif, barang rapih dikemas.',
                        'Harga murah, kualitas terjaga. Beli lagi nanti.',
                        'Pengiriman agak lama tapi barang oke.',
                    ];
                    Review::create([
                        'order_id'   => $order->id,
                        'buyer_id'   => $buyer->id,
                        'store_id'   => $product->store_id,
                        'product_id' => $product->id,
                        'rating'     => rand(3, 5),
                        'comment'    => $comments[array_rand($comments)],
                        'status'     => 'published',
                        'created_at' => $order->created_at->addDays(rand(3, 7)),
                    ]);
                }

                $product->update(['status' => 'sold']);
            }

            $orderCount++;
        }

        $this->command->info("✅ {$orderCount} orders created with payments + reviews");
    }
}
