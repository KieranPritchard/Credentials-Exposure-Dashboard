<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schedule;

// Scheduled command to get the latest breach data from an api and update the database
Schedule::call(function () {
    // Extracts all of the data from the credentials table
    $credentials = DB::table('credentials')->get()->pluck("email")->toArray();

    // Loops through each credential and checks if it has been breached
    foreach ($credentials as $credential) {
        // Calls the breach api to check if the credential has been breached
        $response = Http::get("https://api.xposedornot.com/v1/check-email/{$credential}");

        // Checks if the response is successful
        if ($response->successful()) {
            // Extracts the data from the response
            $data = $response->json();

            // Updates the credential in the database with the latest breach data
            DB::table('credentials')->where('email', $credential)->update([
                'times_breached' => count($data),
                'breach_details' => json_encode($data)
            ]);
        } else {
            // If the response is not successful, it means the credential has not been breached
            DB::table('credentials')->where('email', $credential)->update([
                'times_breached' => 0,
                'breach_details' => null
            ]);
        }
    }
})->everyFiveMinutes();