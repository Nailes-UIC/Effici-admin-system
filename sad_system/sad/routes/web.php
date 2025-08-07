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


// ✅ Show the verifyemail.tsx page (no auth required)
Route::get('/email/verify', function () {
    return Inertia::render('auth/verifyemail', [
        'emailJustSent' => Session::get('status') === 'verification-link-sent',
    ]);
})->name('verification.notice');

// ✅ Handle the verification link (sent via email)
Route::get('/email/verify/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');

// ✅ Resend verification email (requires login)
Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->middleware(['auth', 'throttle:6,1'])
    ->name('verification.send');
    
// 🟩 Role-based Dashboard Routes (authenticated AND verified)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/student/dashboard', fn () => Inertia::render('studentdashboard'))->name('student.dashboard');
    Route::get('/admin/dashboard', fn () => Inertia::render('admindashboard'))->name('admin.dashboard');
    Route::get('/dean/dashboard', fn () => Inertia::render('deandashboard'))->name('dean.dashboard');
});

Route::get('/student/dashboard', StudentDashboardController::class)
    ->middleware(['auth', 'verified'])
    ->name('student.dashboard');

Route::middleware(['auth', 'verified'])->prefix('student')->group(function () {
    Route::get('/activity-request', fn () => Inertia::render('student/ActivityRequest'));
    Route::get('/borrow-equipment', fn () => Inertia::render('student/BorrowEquipment'));
    Route::get('/activity-log', fn () => Inertia::render('student/ActivityLog'));
    Route::get('/revision', fn () => Inertia::render('student/revision'));
    Route::get('/edit-document', fn () => Inertia::render('student/editdocument'));
});

Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    Route::get('/request', fn () => Inertia::render('admin_assistant/request'));
    Route::get('/activity-history', fn () => Inertia::render('admin_assistant/ActivityHistory'));
});

Route::middleware(['auth', 'verified'])->prefix('dean')->group(function () {
    Route::get('/request', fn () => Inertia::render('dean/request'));
    Route::get('/activity-history', fn () => Inertia::render('dean/ActivityHistory'));
});


Route::get('/events', function () {
    $events = \App\Models\Event::all(); // Replace with your actual model or mock data
    return Inertia::render('events/ViewAllEvents', [
        'events' => $events,
    ]);
})->name('events.index');

Route::get('/announcements', function () {
    $announcements = \App\Models\Announcement::all();
    return Inertia::render('announcements/ViewAllAnnouncements', [
        'announcements' => $announcements,
    ]);
})->name('announcements.index');

// 🔄 Include extra route files if needed
require __DIR__ . '/settings.php';
