<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $productId = $this->route('product')->id ?? null;

        return [
            'name'        => ['sometimes', 'string', 'max:255'],
            'slug'        => ['sometimes', 'string', 'max:255', Rule::unique('products', 'slug')->ignore($productId)],
            'description' => ['nullable', 'string'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'type'        => ['sometimes', 'in:simple,variable'],
            'base_price'  => ['sometimes', 'integer', 'min:0'],
            'stock'       => ['nullable', 'integer', 'min:0'],
            'is_active'   => ['boolean'],
            'image'       => ['nullable', 'image', 'max:4096'],
        ];
    }
}
