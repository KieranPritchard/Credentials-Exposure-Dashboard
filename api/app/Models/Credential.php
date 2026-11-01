<?php

namespace App\Models;

use Database\Factories\CredentialFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['user_id', 'email', 'times_breached', 'breach_details', 'last_checked_at'])]
class Credential extends Model
{
    /** @use HasFactory<CredentialFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'times_breached' => 'integer',
            'email' => 'string',
        ];
    }

    protected function breachDetails(): Attribute
    {
        return Attribute::make(
            set: function ($value) {
                if ($value === null) {
                    return null;
                }
                if (is_array($value)) {
                    return json_encode($value);
                }
                if (is_string($value)) {
                    return json_validate($value) ? $value : json_encode(['description' => $value]);
                }

                return json_encode($value);
            },
        );
    }
}
