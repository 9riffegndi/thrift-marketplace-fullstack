<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\SystemConfig;
use Illuminate\Http\JsonResponse;

class DiscoveryController extends Controller
{
    public function banners(): JsonResponse
    {
        $banners = Banner::query()
            ->active()
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $banners,
        ]);
    }

    public function configs(): JsonResponse
    {
        $configs = SystemConfig::query()
            ->get(['key', 'value', 'description'])
            ->pluck('value', 'key');

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $configs,
        ]);
    }
}
