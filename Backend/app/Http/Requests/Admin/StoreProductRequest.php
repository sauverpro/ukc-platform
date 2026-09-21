<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // gated by admin middleware
    }

    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:255'],
            'slug'        => ['nullable', 'string', 'max:255', 'unique:products,slug'],
            'description' => ['nullable', 'string'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'type'        => ['required', 'in:simple,variable'],
            'base_price'  => ['required', 'integer', 'min:0'],
            'stock'       => ['nullable', 'integer', 'min:0'],
            'is_active'   => ['boolean'],
            'image'       => ['nullable', 'image', 'max:4096'], // 4MB
        ];
    }
}
