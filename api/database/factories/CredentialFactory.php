<?php

namespace Database\Factories;

use App\Models\Credential;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CredentialFactory extends Factory
{
    protected $model = Credential::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'email' => $this->faker->unique()->safeEmail(),
            'times_breached' => $this->faker->numberBetween(0, 3),
            'breach_details' => ['description' => $this->faker->sentence()],
        ];
    }
}
