<?php

namespace App\Http\Controllers;

use App\Models\Credential;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CredentialsController extends Controller
{
    // Method to fetch all of the credentials
    public function index(Request $request)
    {
        $user = $request->user('sanctum') ?? $request->user();
        $userId = $user?->id ?? $request->input('user_id');

        if (! $userId) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $credentials = Credential::where('user_id', '=', $userId)->get();

        return response()->json($credentials);
    }

    // Method to add a new credential
    public function addCredentials(Request $request)
    {
        $user = $request->user('sanctum') ?? $request->user();
        $userId = $user?->id ?? $request->input('user_id');

        if (! $userId) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $data = $request->validate([
            'email' => [
                'required',
                'email',
                Rule::unique('credentials')->where(fn ($query) => $query->where('user_id', $userId)),
            ],
            'user_id' => 'sometimes|integer',
        ]);

        $data['user_id'] = $userId;

        $credential = Credential::create($data);

        return response()->json([
            'credential' => $credential,
        ], 201);
    }

    // Method to edit credential
    public function updateCredentials(Request $request)
    {
        $user = $request->user('sanctum') ?? $request->user();
        $userId = $user?->id ?? $request->input('user_id');

        if (! $userId) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $data = $request->validate([
            'id' => 'required|integer|exists:credentials,id',
            'email' => [
                'required',
                'email',
                Rule::unique('credentials')->where(fn ($query) => $query->where('user_id', $userId))->ignore($request->id),
            ],
            'times_breached' => 'required|integer',
            'breach_details' => 'nullable',
        ]);

        $credential = Credential::where('id', $data['id'])
            ->where('user_id', '=', $userId)
            ->firstOrFail();

        $credential->update($data);

        return response()->json([
            'credential' => $credential,
        ], 200);
    }

    // Method to delete the credential
    public function deleteCredentials(Request $request)
    {
        $user = $request->user('sanctum') ?? $request->user();
        $userId = $user?->id ?? $request->input('user_id');

        if (! $userId) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $data = $request->validate([
            'id' => 'required|integer|exists:credentials,id',
        ]);

        $credential = Credential::where('id', $data['id'])
            ->where('user_id', '=', $userId)
            ->firstOrFail();

        $credential->delete();

        return response()->json([
            'credential' => $credential,
        ], 200);
    }
}
