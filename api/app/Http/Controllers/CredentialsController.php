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

        // Stores the credentails
        $credentials = Credential::where('user_id','=', $data['user_id'])->toArray();

        // Send back the credentials
        return response()->json($credentials);
    }

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
