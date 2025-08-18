<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use Illuminate\Support\Facades\Session;
use App\Http\Controllers\StudentDashboardController;
use App\Http\Controllers\ActivityRequestController;

// 🔁 Redirect root to login page
Route::get('/', fn () => redirect()->route('login'));

// 🟩 Login Routes
Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

// 🟩 Registration Routes
Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
Route::post('/register', [RegisteredUserController::class, 'store'])->name('register.store');

// ✅ Optional: Database connection check
Route::get('/db-check', function () {
    try {
        DB::connection()->getPdo();
        return '✅ Connected to DB: ' . DB::connection()->getDatabaseName();
    } catch (\Exception $e) {
        return '❌ DB Error: ' . $e->getMessage();
    }
});

// ✅ Email Verification Routes
Route::get('/email/verify', function () {
    return Inertia::render('auth/verifyemail', [
        'emailJustSent' => Session::get('status') === 'verification-link-sent',
    ]);
})->name('verification.notice');

Route::get('/email/verify/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');

Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->middleware(['auth', 'throttle:6,1'])
    ->name('verification.send');

// 🟩 Role-based Dashboards
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/student/dashboard', StudentDashboardController::class)->name('student.dashboard');
    Route::get('/admin/dashboard', fn () => Inertia::render('admindashboard'))->name('admin.dashboard');
    Route::get('/dean/dashboard', fn () => Inertia::render('deandashboard'))->name('dean.dashboard');
});

// 🟩 Student Routes
Route::middleware(['auth', 'verified'])->prefix('student')->group(function () {
    // 👉 Use controller for activity request so props (stats + requests) are passed
    Route::get('/activity-request', [ActivityRequestController::class, 'index'])
        ->name('student.activity-request');

    Route::get('/borrow-equipment', fn () => Inertia::render('student/BorrowEquipment'))
        ->name('student.borrow-equipment');
    Route::get('/activity-log', fn () => Inertia::render('student/ActivityLog'))
        ->name('student.activity-log');
    Route::get('/revision', fn () => Inertia::render('student/Revision'))
        ->name('student.revision');
    Route::get('/request-tracking', fn () => Inertia::render('student/RequestTracking'))
        ->name('student.request-tracking');
});

// 🟩 Admin Routes
Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    Route::get('/request', fn () => Inertia::render('admin_assistant/request'))
        ->name('admin.request');
    Route::get('/activity-history', fn () => Inertia::render('admin_assistant/ActivityHistory'))
        ->name('admin.activity-history');
});

// 🟩 Dean Routes
Route::middleware(['auth', 'verified'])->prefix('dean')->group(function () {
    Route::get('/request', fn () => Inertia::render('dean/request'))
        ->name('dean.request');
    Route::get('/activity-history', fn () => Inertia::render('dean/ActivityHistory'))
        ->name('dean.activity-history');
});

// 🟩 Events + Announcements
Route::get('/events', function () {
    $events = \App\Models\Event::all();
    return Inertia::render('events/ViewAllEvents', ['events' => $events]);
})->name('events.index');

Route::get('/announcements', function () {
    $announcements = \App\Models\Announcement::all();
    return Inertia::render('announcements/ViewAllAnnouncements', ['announcements' => $announcements]);
})->name('announcements.index');

// 🟩 Activity Request CRUD
Route::middleware(['auth'])->group(function () {
    Route::get('/activity-requests', [ActivityRequestController::class, 'index'])->name('activity-requests.index');
    Route::post('/activity-requests', [ActivityRequestController::class, 'store'])->name('activity-requests.store');
    Route::patch('/activity-requests/{id}', [ActivityRequestController::class, 'update'])->name('activity-requests.update');
    Route::delete('/activity-requests/{requestId}/files/{fileId}', [ActivityRequestController::class, 'destroyFile'])
        ->name('activity-requests.files.destroy');
});

// 🔄 Include extra route files if needed
require __DIR__ . '/settings.php';
