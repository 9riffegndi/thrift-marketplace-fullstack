<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->enum('condition', ['A', 'B', 'C', 'D']);
            $table->decimal('price', 12, 2);
            $table->string('size', 50)->nullable();
            $table->unsignedInteger('weight');
            $table->enum('status', ['active', 'inactive', 'sold', 'reserved', 'suspended'])->default('inactive');
            $table->timestamps();

            $table->index(['category_id', 'condition', 'status']);
            $table->index(['price', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
