<?php

namespace Tests\Feature;

use App\Models\Credential;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CredentialControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_fetch_credentials_for_a_user(): void
    {
        $user = User::factory()->create();
        Credential::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->getJson('/credentials?user_id='.$user->id);

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_add_new_credential(): void
    {
        $user = User::factory()->create();

        $response = $this->postJson('/credentials', [
            'email' => 'breached@example.com',
            'user_id' => $user->id,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('credential.email', 'breached@example.com');

        $this->assertDatabaseHas('credentials', [
            'email' => 'breached@example.com',
            'user_id' => $user->id,
        ]);
    }

    public function test_can_update_credential(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $credential = Credential::factory()->create([
            'user_id' => $user->id,
            'email' => 'old@example.com',
            'times_breached' => 1,
        ]);

        $response = $this->putJson('/credentials', [
            'id' => $credential->id,
            'email' => 'updated@example.com',
            'times_breached' => 2,
            'breach_details' => 'Exposed in data leak',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('credential.email', 'updated@example.com')
            ->assertJsonPath('credential.times_breached', 2);

        $this->assertDatabaseHas('credentials', [
            'id' => $credential->id,
            'email' => 'updated@example.com',
            'times_breached' => 2,
        ]);
    }

    public function test_can_delete_credential(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $credential = Credential::factory()->create([
            'user_id' => $user->id,
        ]);

        $response = $this->deleteJson('/credentials', [
            'id' => $credential->id,
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseMissing('credentials', [
            'id' => $credential->id,
        ]);
    }
}
