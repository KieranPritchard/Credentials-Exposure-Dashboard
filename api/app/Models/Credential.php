<?php

namespace App\Models;

use Database\Factories\CredentialFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'email', 'times_breached', 'breach_details', 'last_checked_at'])]
class Credential extends Model
{
    /** @use HasFactory<CredentialFactory> */
    use HasFactory;

    protected $appends = [
        'timesBreached',
        'breachDetails',
        'userId',
        'createdAt',
        'updatedAt',
    ];

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
            'last_checked_at' => 'datetime',
            'times_breached' => 'integer',
            'email' => 'string',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getTimesBreachedAttribute(): int
    {
        return (int) ($this->attributes['times_breached'] ?? 0);
    }

    public function getUserIdAttribute(): ?int
    {
        return isset($this->attributes['user_id']) ? (int) $this->attributes['user_id'] : null;
    }

    public function getCreatedAtAttribute(): ?string
    {
        return isset($this->attributes['created_at']) ? (string) $this->attributes['created_at'] : null;
    }

    public function getUpdatedAtAttribute(): ?string
    {
        return isset($this->attributes['updated_at']) ? (string) $this->attributes['updated_at'] : null;
    }

    public function getBreachDetailsAttribute()
    {
        $raw = $this->attributes['breach_details'] ?? null;
        if ($raw === null) {
            return null;
        }
        if (is_string($raw)) {
            $decoded = json_decode($raw, true);

            return json_last_error() === JSON_ERROR_NONE ? $decoded : $raw;
        }

        return $raw;
    }

    public function setBreachDetailsAttribute($value): void
    {
        if ($value === null) {
            $this->attributes['breach_details'] = null;
        } elseif (is_array($value)) {
            $this->attributes['breach_details'] = json_encode($value);
        } elseif (is_string($value)) {
            $this->attributes['breach_details'] = json_validate($value) ? $value : json_encode(['description' => $value]);
        } else {
            $this->attributes['breach_details'] = json_encode($value);
        }
    }
}
