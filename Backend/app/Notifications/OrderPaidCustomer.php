<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderPaidCustomer extends Notification
{
    use Queueable;

    public function __construct(private Order $order) {}

    public function via(object $notifiable): array
    {
        return ['mail']; // add 'vonage' or a custom 'sms' channel here later
    }

    public function toMail(object $notifiable): MailMessage
    {
        $mail = (new MailMessage)
            ->subject("UKC Order {$this->order->reference} confirmed")
            ->greeting("Hello {$this->order->customer_name},")
            ->line('Thank you. Your payment was received and your order is confirmed.')
            ->line("Order reference: {$this->order->reference}");

        foreach ($this->order->items as $item) {
            $label = $item->variant_name ? "{$item->product_name} ({$item->variant_name})" : $item->product_name;
            $mail->line("- {$label} x{$item->quantity} = Fr ".number_format($item->line_total));
        }

        return $mail
            ->line('Total: Fr '.number_format($this->order->total))
            ->line("We will contact you on {$this->order->customer_phone} about delivery.")
            ->salutation('UKC Animal Feed Solutions');
    }
}
