<?php

namespace App\Providers;

use App\Services\Payments\FlutterwaveGateway;
use App\Services\Payments\PaymentGateway;
use App\Services\Payments\SandboxGateway;
use Illuminate\Support\ServiceProvider;

class PaymentServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bind the interface to the configured driver. Add a match arm here
        // (e.g. 'paypack' => new PaypackGateway(...)) to support more gateways.
        $this->app->bind(PaymentGateway::class, function () {
            $driver = config('payment.default');

            return match ($driver) {
                'sandbox' => new SandboxGateway(
                    appUrl: rtrim(config('app.url'), '/'),
                ),
                'flutterwave' => new FlutterwaveGateway(
                    secretKey: config('payment.flutterwave.secret_key'),
                    baseUrl: config('payment.flutterwave.base_url'),
                    redirectUrl: config('payment.flutterwave.redirect_url'),
                    webhookSecret: config('payment.flutterwave.webhook_secret'),
                ),
                default => throw new \RuntimeException("Unsupported payment driver: {$driver}"),
            };
        });
    }
}
