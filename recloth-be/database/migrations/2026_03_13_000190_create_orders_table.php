<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('buyer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->restrictOnDelete();
            $table->enum('type', ['buy', 'swap'])->default('buy');
            $table->enum('status', ['menunggu_bayar', 'dikonfirmasi', 'dikirim', 'selesai', 'dibatalkan', 'direfund'])->default('menunggu_bayar');
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('ongkir', 12, 2)->default(0);
            $table->decimal('diskon', 12, 2)->default(0);
            $table->decimal('komisi', 12, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);
            $table->string('courier_code', 20)->nullable();
            $table->string('courier_service', 100)->nullable();
            $table->string('resi', 100)->nullable();
            $table->enum('escrow_status', ['held', 'released', 'refunded'])->default('held');
            $table->timestamps();

            $table->index(['buyer_id', 'status']);
            $table->index(['store_id', 'status']);
            $table->index(['product_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
