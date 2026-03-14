<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'reported_user_id' => 'required|exists:users,id',
            'reason'           => 'required|string|max:100',
            'description'      => 'nullable|string|max:500',
        ]);

        if ($validated['reported_user_id'] === Auth::id()) {
            return response()->json(['success' => false, 'message' => 'Tidak bisa lapor diri sendiri', 'data' => null], 422);
        }

        $report = Report::create(array_merge($validated, [
            'reporter_id' => Auth::id(),
            'status'      => 'pending',
        ]));

        return response()->json(['success' => true, 'message' => 'Laporan terkirim', 'data' => $report], 201);
    }
}
