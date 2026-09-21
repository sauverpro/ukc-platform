<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'reference'        => $this->reference,
            'status'           => $this->status->value,
            'total'            => $this->total,
            'currency'         => $this->currency,
            'customer_name'    => $this->customer_name,
            'customer_phone'   => $this->customer_phone,
            'customer_email'   => $this->customer_email,
            'delivery_address' => $this->delivery_address,
            'items'            => OrderItemResource::collection($this->whenLoaded('items')),
            'payment'          => $this->whenLoaded('payment', fn () => [
                'gateway' => $this->payment?->gateway,
                'status'  => $this->payment?->status->value,
                'tx_ref'  => $this->payment?->tx_ref,
            ]),
            'created_at'       => $this->created_at,
        ];
    }
}
