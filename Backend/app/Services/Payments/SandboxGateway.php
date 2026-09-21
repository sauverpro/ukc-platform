<?php

namespace App\Services\Payments;

use App\Models\Payment;

class SandboxGateway implements PaymentGateway
{
    public function __construct(private string $appUrl) {}

    public function initiate(Payment $payment): array
    {
        return [
            'checkout_url' => "{$this->appUrl}/api/payments/simulate/{$payment->order->reference}",
            'tx_ref' => $payment->tx_ref,
        ];
    }

    public function verify(string $gatewayReference): bool
    {
        return true;
    }

    public function verifyWebhookSignature(string $payload, ?string $signature): bool
    {
        return true;
    }
}
