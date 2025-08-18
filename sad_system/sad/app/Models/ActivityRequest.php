<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityRequest extends Model
{
    protected $fillable = [
        'user_id',
        'activity_name',
        'activity_purpose',
        'category',
        'status',
        'start_datetime',
        'end_datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function files()
    {
        return $this->hasMany(ActivityRequestFile::class);
    }
}
