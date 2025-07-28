<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;

// 🔁 Redirect root to login page
Route::get('/', fn () => redirect()->route('login'));

// 🟩 Login Routes
Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login'); // ✅ use controller here
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

// 🟩 Role-based Dashboard Routes (authenticated only)
Route::middleware(['auth'])->group(function () {
    Route::get('/student/dashboard', fn () => Inertia::render('studentdashboard'))->name('student.dashboard');
    Route::get('/admin/dashboard', fn () => Inertia::render('admindashboard'))->name('admin.dashboard');
    Route::get('/dean/dashboard', fn () => Inertia::render('deandashboard'))->name('dean.dashboard');

});

// Load extra route files if needed
require __DIR__ . '/settings.php';

Route::get('/test-dean', function () {
    return Inertia::render('deandashboard');
});