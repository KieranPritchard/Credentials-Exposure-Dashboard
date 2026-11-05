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

    public function test_two_different_users_can_add_same_email_credential(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        Credential::factory()->create([
            'user_id' => $user1->id,
            'email' => 'shared@example.com',
        ]);

        Sanctum::actingAs($user2);

        $response = $this->postJson('/credentials', [
            'email' => 'shared@example.com',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('credentials', [
            'user_id' => $user2->id,
            'email' => 'shared@example.com',
        ]);
    }

    public function test_same_user_cannot_add_duplicate_email(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        Credential::factory()->create([
            'user_id' => $user->id,
            'email' => 'duplicate@example.com',
        ]);

        $response = $this->postJson('/credentials', [
            'email' => 'duplicate@example.com',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_credentials_return_camel_case_attributes(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        Credential::factory()->create([
            'user_id' => $user->id,
            'email' => 'breachcheck@example.com',
            'times_breached' => 3,
        ]);

        $response = $this->getJson('/credentials');

        $response->assertStatus(200)
            ->assertJsonPath('0.timesBreached', 3)
            ->assertJsonPath('0.times_breached', 3);
    }
}
