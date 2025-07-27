<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User; 
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class RegisterController extends Controller
{
    public function store(Request $request)
    {
        // 🔍 Step 1: Confirm Laravel is receiving the POST request
        // Uncomment for testing: 
         dd('✅ Reached controller', $request->all());

        // 🔍 Step 2: Validate input data
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|min:6|confirmed',
            'role'       => 'required|in:student,admin_assistant,dean',
        ]);

        // 🔍 Step 3: Attempt to create the user
        try {
            User::create([
                'first_name' => $validated['first_name'],
                'last_name'  => $validated['last_name'],
                'email'      => $validated['email'],
                'password'   => Hash::make($validated['password']),
                'role'       => $validated['role'],
            ]);
        } catch (\Exception $e) {
            // 🔥 If DB insert fails, show error
            dd('❌ Error saving user:', $e->getMessage());
        }

        // ✅ Step 4: Redirect using Inertia-compatible full redirect
        return Inertia::location(route('login'));
    }
}
