<?php
// app/Http/Controllers/EquipmentRequestController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EquipmentRequestController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'activity_request_id'    => ['nullable','integer','exists:activity_requests,id'],
            'purpose'                => ['required','string','max:255'],
            'start_datetime'         => ['required','date'],
            'end_datetime'           => ['required','date','after:start_datetime'],
            'items'                  => ['required','array','min:1'],
            'items.*.equipment_id'   => ['required','integer','exists:equipment,id'],
            'items.*.quantity'       => ['required','integer','min:1'],
        ]);

        $userId = Auth::id();

        DB::transaction(function () use ($validated, $userId) {
            // Check availability for each line
            foreach ($validated['items'] as $line) {
                $available = DB::selectOne("
                    SELECT
                      e.total_quantity
                       - IFNULL(SUM(CASE
                           WHEN er.status IN ('pending','approved','checked_out')
                            AND NOT (er.end_datetime <= ? OR er.start_datetime >= ?)
                           THEN eri.quantity ELSE 0 END), 0) AS available
                    FROM equipment e
                    LEFT JOIN equipment_request_items eri ON eri.equipment_id = e.id
                    LEFT JOIN equipment_requests er ON er.id = eri.equipment_request_id
                    WHERE e.id = ?
                    GROUP BY e.id
                ", [$validated['start_datetime'], $validated['end_datetime'], $line['equipment_id']]);

                $availQty = $available->available ?? 0;
                if ($availQty < $line['quantity']) {
                    abort(422, 'Not enough available stock for the selected time window.');
                }
            }

            // Create request header
            $reqId = DB::table('equipment_requests')->insertGetId([
                'user_id' => $userId,
                'activity_request_id' => $validated['activity_request_id'] ?? null,
                'purpose' => $validated['purpose'],
                'status' => 'pending', // change to 'approved' via admin flow later
                'start_datetime' => $validated['start_datetime'],
                'end_datetime' => $validated['end_datetime'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Insert items
            $items = array_map(function ($line) use ($reqId) {
                return [
                    'equipment_request_id' => $reqId,
                    'equipment_id' => $line['equipment_id'],
                    'quantity' => $line['quantity'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }, $validated['items']);

            DB::table('equipment_request_items')->insert($items);
        });

        return back()->with('success', 'Equipment request submitted!');
    }
}
