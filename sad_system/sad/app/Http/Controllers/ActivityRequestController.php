<?php

namespace App\Http\Controllers;

use App\Models\ActivityRequest;
use App\Models\ActivityRequestFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class ActivityRequestController extends Controller
{
    /**
     * Display a listing of activity requests
     */
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Load requests with relationships
        $requestsQuery = ActivityRequest::with('files');

        // If student, only their own requests
        if ($user->role === 'student') {
            $requestsQuery->where('user_id', $user->id);
        }

        $requests = $requestsQuery->orderBy('created_at', 'desc')->get();

        // ✅ Always calculate stats fresh from DB (not from $requests only)
        if ($user->role === 'student') {
            $stats = [
                'total'        => ActivityRequest::where('user_id', $user->id)->count(),
                'pending'      => ActivityRequest::where('user_id', $user->id)->where('status', 'pending')->count(),
                'under_review' => ActivityRequest::where('user_id', $user->id)->where('status', 'under_review')->count(),
                'approved'     => ActivityRequest::where('user_id', $user->id)->where('status', 'approved')->count(),
                'completed'    => ActivityRequest::where('user_id', $user->id)->where('status', 'completed')->count(),
            ];
        } else {
            // Admins & Dean see all requests
            $stats = [
                'total'        => ActivityRequest::count(),
                'pending'      => ActivityRequest::where('status', 'pending')->count(),
                'under_review' => ActivityRequest::where('status', 'under_review')->count(),
                'approved'     => ActivityRequest::where('status', 'approved')->count(),
                'completed'    => ActivityRequest::where('status', 'completed')->count(),
            ];
        }

        return Inertia::render('student/ActivityRequest', [
            'auth'             => ['user' => $user],
            'activityRequests' => $requests,
            'stats'            => $stats,
            'flash'            => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    /**
     * Store a new activity request
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'student') {
            return redirect()->back()->with('error', 'Only students can submit activity requests.');
        }

        $validated = $request->validate([
            'activity_name'     => 'required|string|max:255',
            'activity_purpose'  => 'required|string',
            'category'          => ['required', Rule::in(['minor', 'normal', 'urgent'])],
            'start_datetime'    => 'required|date',
            'end_datetime'      => 'required|date|after:start_datetime',
            'files.*'           => 'nullable|file|max:5120',
        ]);

        // Create the activity request
        $activity = ActivityRequest::create([
            'user_id'          => $user->id,
            'activity_name'    => $validated['activity_name'],
            'activity_purpose' => $validated['activity_purpose'],
            'category'         => $validated['category'],
            'start_datetime'   => $validated['start_datetime'],
            'end_datetime'     => $validated['end_datetime'],
            'status'           => 'pending',
        ]);

        // Handle file uploads
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('activity_files', 'public');

                ActivityRequestFile::create([
                    'activity_request_id' => $activity->id,
                    'file_name'           => $file->getClientOriginalName(),
                    'file_path'           => $path,
                    'file_type'           => $file->getMimeType(),
                    'file_size'           => $file->getSize(),
                ]);
            }
        }

        // ✅ Redirect ensures fresh stats will reload
        return redirect()
            ->route('activity-requests.index')
            ->with('success', 'Activity request submitted successfully!');
    }

    /**
     * Update request status (for admins/dean)
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();

        if (!$user || $user->role === 'student') {
            return redirect()->back()->with('error', 'You don\'t have permission to update request status.');
        }

        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'under_review', 'approved', 'completed'])],
        ]);

        $activity = ActivityRequest::findOrFail($id);
        $activity->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Delete an attached file
     */
    public function destroyFile($requestId, $fileId)
    {
        $file = ActivityRequestFile::where('activity_request_id', $requestId)
            ->where('id', $fileId)
            ->firstOrFail();

        Storage::disk('public')->delete($file->file_path);
        $file->delete();

        return redirect()->back()->with('success', 'File removed successfully!');
    }
}
