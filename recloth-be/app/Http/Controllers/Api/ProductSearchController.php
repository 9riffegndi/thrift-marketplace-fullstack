<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductSearchController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:255'],
            'category_id' => ['nullable', 'integer'],
            'condition' => ['nullable', 'in:A,B,C,D'],
            'city' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'in:active,inactive,sold,reserved,suspended'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0'],
            'sort' => ['nullable', 'in:latest,price_asc,price_desc,price_low,price_high'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $query = $validated['q'] ?? '';
        $perPage = $validated['per_page'] ?? 12;

        $filters = ["status = active"];

        if (! empty($validated['category_id'])) {
            $filters[] = 'category_id = '.$validated['category_id'];
        }

        if (! empty($validated['condition'])) {
            $filters[] = 'condition = "'.$validated['condition'].'"';
        }

        if (! empty($validated['city'])) {
            $filters[] = 'city = "'.$validated['city'].'"';
        }

        if (isset($validated['min_price'])) {
            $filters[] = 'price >= '.$validated['min_price'];
        }

        if (isset($validated['max_price'])) {
            $filters[] = 'price <= '.$validated['max_price'];
        }

        $sortMap = [
            'latest' => ['created_at:desc'],
            'price_asc' => ['price:asc'],
            'price_desc' => ['price:desc'],
            'price_low' => ['price:asc'],
            'price_high' => ['price:desc'],
        ];

        $sort = $sortMap[$validated['sort'] ?? 'latest'];

        if (config('scout.driver') === 'database' || empty($query)) {
            $eloquentQuery = Product::query()->with('photos')->where('status', 'active');

            if (! empty($query)) {
                $eloquentQuery->where(function ($q) use ($query) {
                    $q->where('name', 'LIKE', "%{$query}%")
                      ->orWhere('description', 'LIKE', "%{$query}%");
                });
            }

            if (! empty($validated['category_id'])) {
                $eloquentQuery->where('category_id', $validated['category_id']);
            }

            if (! empty($validated['condition'])) {
                $eloquentQuery->where('condition', $validated['condition']);
            }

            if (isset($validated['min_price'])) {
                $eloquentQuery->where('price', '>=', $validated['min_price']);
            }

            if (isset($validated['max_price'])) {
                $eloquentQuery->where('price', '<=', $validated['max_price']);
            }

            if ($validated['sort'] ?? null) {
                switch ($validated['sort']) {
                    case 'latest': $eloquentQuery->latest(); break;
                    case 'price_asc': case 'price_low': $eloquentQuery->orderBy('price', 'asc'); break;
                    case 'price_desc': case 'price_high': $eloquentQuery->orderBy('price', 'desc'); break;
                }
            } else {
                $eloquentQuery->latest();
            }

            $result = $eloquentQuery->paginate($perPage);
        } else {
            $searchBuilder = Product::search($query);
            
            if (! empty($validated['category_id'])) {
                $searchBuilder->where('category_id', $validated['category_id']);
            }

            if (! empty($validated['condition'])) {
                $searchBuilder->where('condition', $validated['condition']);
            }

            $result = $searchBuilder->paginate($perPage);
        }

        $result->getCollection()->load('photos');
        $result->setCollection(
            $result->getCollection()->map(function (Product $product) {
                $primaryPhoto = $product->photos->firstWhere('is_primary', true)
                    ?? $product->photos->sortBy('sort_order')->first();

                return array_merge($product->toArray(), [
                    'primary_photo_url' => $primaryPhoto?->photo_url,
                ]);
            })
        );

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil diambil.',
            'data' => $result,
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $product = Product::query()
            ->with(['photos', 'store', 'category'])
            ->where(function ($query) use ($slug) {
                $query->where('slug', $slug);
                if (is_numeric($slug)) {
                    $query->orWhere('id', $slug);
                }
            })
            ->first();

        if (! $product || ! in_array($product->status, ['active', 'sold', 'reserved'])) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan.',
                'data' => null,
            ], 404);
        }

        $similar = Product::query()
            ->where('id', '!=', $product->id)
            ->where('category_id', $product->category_id)
            ->where('status', 'active')
            ->latest()
            ->limit(8)
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Detail produk berhasil diambil.',
            'data' => [
                'product' => $product,
                'similar_products' => $similar,
            ],
        ]);
    }
}
