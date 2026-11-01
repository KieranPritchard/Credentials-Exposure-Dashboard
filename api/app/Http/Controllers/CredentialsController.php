<?php

namespace App\Http\Controllers;

use App\Models\Credential;
use Illuminate\Http\Request;

class CredentialsController extends Controller
{
    // Method to fetch all of the credentials
    public function index(Request $request)
    {
        $user = $request->user('sanctum') ?? $request->user();
        $userId = $user?->id ?? $request->input('user_id');

        $credentials = Credential::where('user_id', '=', $userId)->get();

        return response()->json($credentials);
    }

    // Method to add a new credential
    public function addCredentials(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email|unique:credentials,email',
            'user_id' => 'sometimes|integer',
        ]);

        $user = $request->user('sanctum') ?? $request->user();
        if (! isset($data['user_id']) && $user) {
            $data['user_id'] = $user->id;
        }

        $credential = Credential::create($data);

        return response()->json([
            'credential' => $credential,
        ], 201);
    }

    // Method to edit credential
    public function updateCredentials(Request $request)
    {
        $data = $request->validate([
            'id' => 'required|integer|exists:credentials,id',
            'email' => 'required|email|unique:credentials,email,'.$request->id,
            'times_breached' => 'required|integer',
            'breach_details' => 'nullable|string',
        ]);

        $user = $request->user('sanctum') ?? $request->user();
        $credential = Credential::where('id', $data['id'])
            ->where('user_id', '=', $user?->id)
            ->firstOrFail();

        $credential->update($data);

        return response()->json([
            'credential' => $credential,
        ], 200);
    }

    // Method to delete the credential
    public function deleteCredentials(Request $request)
    {
        $data = $request->validate([
            'id' => 'required|integer|exists:credentials,id',
        ]);

        $user = $request->user('sanctum') ?? $request->user();
        $credential = Credential::where('id', $data['id'])
            ->where('user_id', '=', $user?->id)
            ->firstOrFail();

        $credential->delete();

        return response()->json([
            'credential' => $credential,
        ], 200);
    }
}
