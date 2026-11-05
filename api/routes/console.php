<?php

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schedule;

// Scheduled command to get the latest breach data from an api and update the database
Schedule::call(function () {
    // Extracts unique emails from the credentials table to prevent duplicate checks
    $emails = DB::table('credentials')->distinct()->pluck('email');

    // Loops through each credential and checks if it has been breached
    foreach ($emails as $email) {
        try {
            // Calls the breach api to check if the credential has been breached
            $response = Http::timeout(10)->get('https://api.xposedornot.com/v1/check-email/'.rawurlencode($email));
        } catch (ConnectionException $e) {
            // Skips this credential and carries on with the rest
            Log::warning("Breach check failed for {$email}: {$e->getMessage()}");

            continue;
        }

        if ($response->successful()) {
            // The api nests the breach names, so flatten them into one list
            $breaches = collect($response->json('breaches', []))->flatten()->values();

            // Updates the credential in the database with the latest breach data
            DB::table('credentials')->where('email', $email)->update([
                'times_breached' => $breaches->count(),
                'breach_details' => $breaches->toJson(),
                'last_checked_at' => now(),
                'updated_at' => now(),
            ]);
        } elseif ($response->status() === 404) {
            // A 404 means the credential has not been breached
            DB::table('credentials')->where('email', $email)->update([
                'times_breached' => 0,
                'breach_details' => null,
                'last_checked_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            // Rate limit or server error, so leave the existing data alone
            Log::warning("Breach api returned {$response->status()} for {$email}");
        }

        // Stays under the api rate limit
        sleep(1);
    }
})->name('refresh-breach-data')->everyMinute()->withoutOverlapping();
