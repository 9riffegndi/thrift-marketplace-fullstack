<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    public function index()
    {
        $addresses = Address::where('user_id', Auth::id())->orderByDesc('is_primary')->get();
        return response()->json(['success' => true, 'message' => 'OK', 'data' => $addresses]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label'          => 'required|string|max:50',
            'recipient_name' => 'required|string|max:100',
            'phone'          => 'required|string|max:20',
            'address'        => 'required|string',
            'city'           => 'required|string|max:100',
            'province'       => 'required|string|max:100',
            'postal_code'    => 'required|string|max:10',
            'is_primary'     => 'boolean',
        ]);

        return DB::transaction(function () use ($validated) {
            $isPrimary = $validated['is_primary'] ?? false;
            $hasAny = Address::where('user_id', Auth::id())->exists();
            if (!$hasAny) $isPrimary = true;

            if ($isPrimary) {
                Address::where('user_id', Auth::id())->update(['is_primary' => false]);
            }

            $address = Address::create(array_merge($validated, ['user_id' => Auth::id(), 'is_primary' => $isPrimary]));
            return response()->json(['success' => true, 'message' => 'Alamat ditambahkan', 'data' => $address], 201);
        });
    }

    public function update(Request $request, int $id)
    {
        $address = Address::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        $validated = $request->validate([
            'label'          => 'sometimes|string|max:50',
            'recipient_name' => 'sometimes|string|max:100',
            'phone'          => 'sometimes|string|max:20',
            'address'        => 'sometimes|string',
            'city'           => 'sometimes|string|max:100',
            'province'       => 'sometimes|string|max:100',
            'postal_code'    => 'sometimes|string|max:10',
        ]);

        $address->update($validated);
        return response()->json(['success' => true, 'message' => 'Alamat diperbarui', 'data' => $address]);
    }

    public function destroy(int $id)
    {
        Address::where('id', $id)->where('user_id', Auth::id())->firstOrFail()->delete();
        return response()->json(['success' => true, 'message' => 'Alamat dihapus', 'data' => null]);
    }

    public function setPrimary(int $id)
    {
        return DB::transaction(function () use ($id) {
            Address::where('user_id', Auth::id())->update(['is_primary' => false]);
            $address = Address::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
            $address->update(['is_primary' => true]);
            return response()->json(['success' => true, 'message' => 'Alamat utama diperbarui', 'data' => $address]);
        });
    }
}
