<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('gateway')->default('flutterwave'); // flutterwave | paypack | ...
            $table->string('tx_ref')->unique();                // our reference sent to gateway
            $table->string('gateway_reference')->nullable();   // id returned by gateway
            $table->enum('status', ['pending', 'successful', 'failed'])->default('pending');
            $table->unsignedInteger('amount'); // RWF
            $table->string('currency', 3)->default('RWF');
            $table->json('meta')->nullable();  // raw gateway payload for audit
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
