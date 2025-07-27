<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisteredUserController; // Updated from RegisterController

// Redirect root to login page
Route::get('/', fn () => redirect()->route('login'));

// Show login page using Inertia
Route::get('/login', fn () => Inertia::render('Auth/Login'))->name('login');

// Handle login submission
Route::post('/login', [LoginController::class, 'store']);

// Logout
Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

// ✅ Registration routes (cleaned and controller-based)
Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
Route::post('/register', [RegisteredUserController::class, 'store'])->name('register.store');

// ✅ Protected routes (must be authenticated)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');
});

// ✅ Database connection test
Route::get('/db-check', function () {
    try {
        DB::connection()->getPdo();
        return '✅ Database is connected: ' . DB::connection()->getDatabaseName();
    } catch (\Exception $e) {
        return '❌ Database connection failed: ' . $e->getMessage();
    }
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
