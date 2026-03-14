<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Product extends Model
{
    use HasFactory, Searchable;

    protected $fillable = [
        'store_id',
        'category_id',
        'name',
        'slug',
        'description',
        'condition',
        'price',
        'size',
        'weight',
        'status',
    ];

    protected $appends = [
        'primary_photo',
        'primary_photo_url',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'weight' => 'integer',
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopeSuspended(Builder $query): Builder
    {
        return $query->where('status', 'suspended');
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(ProductPhoto::class);
    }

    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(Cart::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function requesterSwaps(): HasMany
    {
        return $this->hasMany(Swap::class, 'requester_product_id');
    }

    public function targetSwaps(): HasMany
    {
        return $this->hasMany(Swap::class, 'target_product_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function getPrimaryPhotoAttribute()
    {
        return $this->photos->firstWhere('is_primary', true) 
            ?? $this->photos->sortBy('sort_order')->first();
    }

    public function getPrimaryPhotoUrlAttribute()
    {
        $photo = $this->getPrimaryPhotoAttribute();
        
        if (!$photo) return null;
        
        if (str_starts_with($photo->photo_url, 'http')) {
            return $photo->photo_url;
        }
        
        return url('storage/' . $photo->photo_url);
    }

    public function searchableAs(): string
    {
        return 'products';
    }

    public function toSearchableArray(): array
    {
        $this->loadMissing(['category:id,name', 'store:id,city']);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'category_id' => $this->category_id,
            'category_name' => $this->category?->name,
            'condition' => $this->condition,
            'price' => (float) $this->price,
            'city' => $this->store?->city,
            'status' => $this->status,
            'created_at' => optional($this->created_at)->timestamp,
        ];
    }
}
