<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('swaps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('requester_product_id')->constrained('products')->restrictOnDelete();
            $table->foreignId('target_product_id')->constrained('products')->restrictOnDelete();
            $table->enum('status', ['diajukan', 'diterima', 'ditolak', 'selesai', 'dibatalkan'])->default('diajukan');
            $table->string('buyer_resi', 100)->nullable();
            $table->string('seller_resi', 100)->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('swaps');
    }
};
