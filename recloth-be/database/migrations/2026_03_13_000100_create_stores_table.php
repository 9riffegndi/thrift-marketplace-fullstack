<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('photo')->nullable();
            $table->string('city');
            $table->string('province');
            $table->text('address');
            $table->decimal('rating', 3, 2)->default(0);
            $table->unsignedInteger('total_sales')->default(0);
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('inactive');
            $table->timestamps();

            $table->index(['status', 'rating']);
            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
