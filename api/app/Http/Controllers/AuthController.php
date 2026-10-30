<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Method to register the user
    public function register(Request $request)
    {
        // Stores the data from the request
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Creates a new user using the user model
        $user = User::create($data);

        // Sends back a response with 201 'created' status
        return response()->json([
            'user' => $user,
            'token' => $user->createToken('web')->plainTextToken,
        ], 201);
    }

    // Method to login the user
    public function login(Request $request)
    {
        // Validates data from the request
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // Extracts the user based on the email
        $user = User::where('email', $data['email'])->first();

        // Checks if there was not a user and if the password matches
        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Creates a web token
        return response()->json([
            'user' => $user,
            'token' => $user->createToken('web')->plainTextToken,
        ]);
    }
}
