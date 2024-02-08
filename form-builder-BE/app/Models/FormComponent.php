<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormComponent extends Model
{
    use HasFactory;
    protected $table = 'form_Components';
    protected $fillable = ['name', 'left', 'top'];
}
