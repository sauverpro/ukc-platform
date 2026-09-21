<?php

namespace App\Services\Payments;

use App\Models\Payment;

interface PaymentGateway
{
    /**
     * Start a payment. Returns an array with at least:
     *  - 'checkout_url' (string) hosted page the client redirects to
     *  - 'tx_ref'       (string) our reference
     */
    public function initiate(Payment $payment): array;

    /**
     * Verify a payment with the gateway using its reference/transaction id.
     * Returns true when the gateway confirms the charge succeeded.
     */
    public function verify(string $gatewayReference): bool;

    /**
     * Validate an incoming webhook request (signature check).
     */
    public function verifyWebhookSignature(string $payload, ?string $signature): bool;
}
