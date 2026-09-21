<?php

namespace App\Services\Payments;

use App\Models\Payment;
use Illuminate\Support\Facades\Http;

/**
 * Flutterwave Standard checkout. Supports RWF cards + MTN/Airtel mobile money.
 * To swap to Paypack (local MoMo), implement PaymentGateway the same way and
 * rebind it in a service provider or config/payment.php — controllers stay unchanged.
 */
class FlutterwaveGateway implements PaymentGateway
{
    public function __construct(
        private string $secretKey,
        private string $baseUrl,
        private string $redirectUrl,
        private ?string $webhookSecret = null,
    ) {}

    public function initiate(Payment $payment): array
    {
        $order = $payment->order;

        $response = Http::withToken($this->secretKey)
            ->acceptJson()
            ->post("{$this->baseUrl}/payments", [
                'tx_ref'       => $payment->tx_ref,
                'amount'       => $payment->amount,
                'currency'     => $payment->currency,
                'redirect_url' => $this->redirectUrl,
                'customer'     => [
                    'email'       => $order->customer_email ?: 'guest@ukc.rw',
                    'phonenumber' => $order->customer_phone,
                    'name'        => $order->customer_name,
                ],
                'customizations' => [
                    'title'       => 'UKC Animal Feed Solutions',
                    'description' => "Order {$order->reference}",
                ],
            ]);

        $response->throw();

        return [
            'checkout_url' => data_get($response->json(), 'data.link'),
            'tx_ref'       => $payment->tx_ref,
        ];
    }

    public function verify(string $gatewayReference): bool
    {
        $response = Http::withToken($this->secretKey)
            ->acceptJson()
            ->get("{$this->baseUrl}/transactions/{$gatewayReference}/verify");

        if ($response->failed()) {
            return false;
        }

        return data_get($response->json(), 'data.status') === 'successful';
    }

    public function verifyWebhookSignature(string $payload, ?string $signature): bool
    {
        if (empty($this->webhookSecret)) {
            return false;
        }

        // Flutterwave sends the configured secret hash in the verif-hash header.
        return hash_equals($this->webhookSecret, (string) $signature);
    }
}
