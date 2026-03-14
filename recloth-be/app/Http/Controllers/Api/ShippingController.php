<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\RajaOngkirService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShippingController extends Controller
{
    public function __construct(private readonly RajaOngkirService $rajaOngkirService)
    {
    }

    public function cost(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'destination_city_id' => ['required', 'string', 'max:50'],
            'courier' => ['nullable', 'string'],
        ]);

        $product = Product::query()->with('store.couriers')->findOrFail($validated['product_id']);

        $origin = (string) $product->store->city;
        $destination = $validated['destination_city_id'];
        $weight = (int) $product->weight;
        $requestedCourier = $validated['courier'] ?? null;

        $allCosts = [];
        foreach ($product->store->couriers as $courier) {
            if ($requestedCourier && strtolower($courier->courier_code) !== strtolower($requestedCourier)) {
                continue;
            }

            $res = $this->rajaOngkirService->getCost(
                $origin,
                $destination,
                $weight,
                $courier->courier_code
            );

            // RajaOngkir results usually return as:
            // [ { code, name, costs: [ { service, description, cost: [{value, etd}] } ] } ]
            // We want to flatten this to just the services.
            foreach ($res as $courierRes) {
                if (isset($courierRes['costs'])) {
                    foreach ($courierRes['costs'] as $service) {
                        $allCosts[] = $service;
                    }
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Ongkir berhasil dihitung.',
            'data' => $allCosts,
        ]);
    }
}
