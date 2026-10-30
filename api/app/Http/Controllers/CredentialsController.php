<?php

namespace App\Http\Controllers;

use App\Models\Credential;
use Illuminate\Http\Request;

class CredentialsController extends Controller
{
    // Method to add a new crediental
    public function addCredentials(Request $request) {
        // Stores the data from the request
        $data = $request->validate([
            'email' => 'required|email|unique:credientials',
            'user_id' => 'required|integer'
        ]);

        // Creates a new crediential
        $credential = Credential::create($data);

        // Sends back a response with 201 'created' status
        return response()->json([
            'credential' => $credential,
        ], 201);
    }
}
