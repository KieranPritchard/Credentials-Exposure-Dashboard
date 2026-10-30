<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('credentials', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // Defined before the foreign key
            $table->string('email');
            $table->integer('times_breached')->default(0);
            $table->json('breach_details')->nullable();      // Optional: stores the raw HIBP breach data
            $table->timestamp('last_checked_at')->nullable(); // Optional: helps manage HIBP rate limits & caching
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['user_id', 'email']); // Prevents users from adding the same email twice
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credentials');
    }
};
