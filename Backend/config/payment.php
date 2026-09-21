<?php

return [
    'default' => env('PAYMENT_DRIVER', 'flutterwave'),

    'flutterwave' => [
        'secret_key'     => env('FLW_SECRET_KEY'),
        'base_url'       => env('FLW_BASE_URL', 'https://api.flutterwave.com/v3'),
        'redirect_url'   => env('FLW_REDIRECT_URL', env('APP_URL') . '/api/payments/callback'),
        'webhook_secret' => env('FLW_WEBHOOK_SECRET'),
    ],
];
