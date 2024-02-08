<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Forms;

class formcontroller extends Controller
{
    public function index()
    {
        $forms = Forms::all();
        return response()->json($forms);
    }
    
    public function store(Request $request){

        return Forms::create($request->all());

    }
}
