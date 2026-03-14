<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('store_couriers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->enum('courier_code', ['jne', 'jnt', 'sicepat', 'pos', 'ninja']);

            $table->unique(['store_id', 'courier_code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('store_couriers');
    }
};
