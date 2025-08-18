<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityRequestFile extends Model
{
    protected $fillable = [
        'activity_request_id',
        'file_name',
        'file_path',
        'file_type',
        'file_size',
    ];

    public function request()
    {
        return $this->belongsTo(ActivityRequest::class, 'activity_request_id');
    }
}
