<?php

namespace App\Http\Controllers;

use App\Models\Credential;
use Illuminate\Http\Request;

class CredentialsController extends Controller
{
    // Method to fetch all of the credentials
    public function index(Request $request)
    {
        // Stores the data from the request
        $data = $request->validate([
            'user_id' => 'required|integer'
        ]);

        // Stores the credentials (Fixed: added ->get() to execute the query)
        $credentials = Credential::where('user_id','=', $data['user_id'])->get();

        // Send back the credentials
        return response()->json($credentials);
    }

    // Method to add a new credential
    public function addCredentials(Request $request) {
        // Stores the data from the request
        $data = $request->validate([
            'email' => 'required|email|unique:credentials,email', // Fixed table name typo
            'user_id' => 'required|integer'
        ]);

        // Creates a new credential
        $credential = Credential::create($data);

        // Sends back a response with 201 'created' status
        return response()->json([
            'credential' => $credential,
        ], 201);
    }

    // Method to edit credential
    public function updateCredentials(Request $request) {
        // Stores and validates the data from the request
        $data = $request->validate([
            'id' => 'required|integer|exists:credentials,id', // Added ID validation
            'email' => 'required|email|unique:credentials,email,' . $request->id,
            'times_breached' => 'required|integer',
            'breach_details' => 'nullable|string',
        ]);

        // Updates the credentials (Fixed: targets specific credential and user)
        $credential = Credential::where('id', $data['id'])
            ->where('user_id','=', $request->user()->id)
            ->firstOrFail();

        $credential->update($data);

        // Returns the updated credential (Note: changed to 200 OK because 204 cannot return a body)
        return response()->json([
            'credential'=> $credential
        ], 200);
    }

    // Method to delete the credential
    public function deleteCredentials(Request $request) {
        $data = $request->validate([
            'id' => 'required|integer|exists:credentials,id',
        ]);

        // Gets the credential (Fixed: targets specific credential and user)
        $credential = Credential::where('id', $data['id'])
            ->where('user_id','=', $request->user()->id)
            ->firstOrFail();

        // Deletes the credential
        $credential->delete();

        // Sends back the response (Note: changed to 200 OK because 204 cannot return a body)
        return response()->json([
            'credential'=> $credential
        ], 200);
    }
}