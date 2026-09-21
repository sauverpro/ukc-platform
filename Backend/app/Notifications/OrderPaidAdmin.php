<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderPaidAdmin extends Notification
{
    use Queueable;

    public function __construct(private Order $order) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("New paid order: {$this->order->reference}")
            ->line('A new order has been paid and needs fulfilment.')
            ->line("Reference: {$this->order->reference}")
            ->line("Customer: {$this->order->customer_name} ({$this->order->customer_phone})")
            ->line('Total: Fr '.number_format($this->order->total))
            ->line('Delivery: '.($this->order->delivery_address ?: 'not provided'));
    }
}
