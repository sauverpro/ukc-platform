<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVariantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $variantId = $this->route('variant')->id ?? null;

        return [
            'name'  => ['sometimes', 'string', 'max:255'],
            'sku'   => ['nullable', 'string', 'max:255', Rule::unique('product_variants', 'sku')->ignore($variantId)],
            'price' => ['sometimes', 'integer', 'min:0'],
            'stock' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
