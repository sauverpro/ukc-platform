<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\User;
use App\Notifications\OrderPaidAdmin;
use App\Notifications\OrderPaidCustomer;
use App\Services\Payments\PaymentGateway;
use App\Services\StockManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class PaymentController extends Controller
{
    public function __construct(
        private PaymentGateway $gateway,
        private StockManager $stock,
    ) {}

    /**
     * Browser return URL after the hosted checkout. We re-verify server-side
     * rather than trusting query params.
     */
    public function callback(Request $request): JsonResponse
    {
        $txRef = $request->query('tx_ref');
        $status = $request->query('status');
        $txId = $request->query('transaction_id');

        $payment = Payment::where('tx_ref', $txRef)->firstOrFail();

        if ($status === 'successful' && $txId && $this->gateway->verify($txId)) {
            $this->markPaid($payment, $txId, $request->all());

            return response()->json(['message' => 'Payment confirmed.', 'status' => 'successful']);
        }

        $payment->update(['status' => PaymentStatus::Failed, 'meta' => $request->all()]);

        $this->stock->release($payment->order);

        return response()->json(['message' => 'Payment not completed.', 'status' => 'failed'], 402);
    }

    /**
     * Server-to-server webhook. Source of truth for fulfilment.
     */
    public function webhook(Request $request): JsonResponse
    {
        $signature = $request->header('verif-hash');

        if (! $this->gateway->verifyWebhookSignature($request->getContent(), $signature)) {
            return response()->json(['message' => 'Invalid signature.'], 401);
        }

        $txRef = data_get($request->all(), 'data.tx_ref');
        $txId = data_get($request->all(), 'data.id');
        $status = data_get($request->all(), 'data.status');

        $payment = Payment::where('tx_ref', $txRef)->first();

        if ($payment && $status === 'successful' && $this->gateway->verify((string) $txId)) {
            $this->markPaid($payment, (string) $txId, $request->all());
        }

        // Always 200 so the gateway stops retrying a handled event
        return response()->json(['message' => 'ok']);
    }

    public function simulate(Request $request, string $reference)
    {
        abort_unless(app()->environment('local'), 404);

        $payment = Payment::whereHas('order', fn ($q) => $q->where('reference', $reference))
            ->firstOrFail();

        $this->markPaid($payment, 'SIMULATED-'.$payment->tx_ref, ['simulated' => true]);

        return response()->json(['message' => 'Payment simulated.', 'status' => 'successful']);
    }

    private function markPaid(Payment $payment, string $gatewayReference, array $meta): void
    {
        if ($payment->status === PaymentStatus::Successful) {
            return; // idempotent
        }

        $payment->update([
            'status' => PaymentStatus::Successful,
            'gateway_reference' => $gatewayReference,
            'meta' => $meta,
        ]);

        $payment->order->update(['status' => OrderStatus::Paid]);

        $this->stock->commit($payment->order);

        $order = $payment->order->load('items');

        if ($order->customer_email) {
            Notification::route('mail', $order->customer_email)
                ->notify(new OrderPaidCustomer($order));
        }

        Notification::send(
            User::where('is_admin', true)->get(),
            new OrderPaidAdmin($order)
        );
    }
}
