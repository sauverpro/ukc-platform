<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\User;
use Illuminate\Support\Str;

/**
 * Resolves the "current" cart for either a logged-in user or an anonymous
 * guest. Guests are identified by a random token (sent in the X-Cart-Token
 * header). When a guest later logs in and checks out, their guest cart is
 * claimed by the account.
 */
class CartResolver
{
    public function resolve(?User $user, ?string $token): Cart
    {
        if ($user) {
            $cart = Cart::where('user_id', $user->id)->first();
            if ($cart) {
                return $cart;
            }

            if ($token) {
                $guest = Cart::whereNull('user_id')->where('token', $token)->first();
                if ($guest) {
                    $guest->update(['user_id' => $user->id]);

                    return $guest;
                }
            }

            return Cart::create(['user_id' => $user->id, 'token' => Str::random(40)]);
        }

        if ($token) {
            $cart = Cart::whereNull('user_id')->where('token', $token)->first();
            if ($cart) {
                return $cart;
            }
        }

        return Cart::create(['token' => Str::random(40)]);
    }
}
