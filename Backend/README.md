# UKC Animal Feed Solutions - API

API-only backend for the UKC animal feed shop, rebuilt in Laravel from the
original WooCommerce site. Serves a catalog, guest and customer carts, orders,
stock control, payments, notifications, and a full admin surface. There is no
frontend in this project; the API is the deliverable and is documented live via
Scramble.

Prices are stored as integer Rwandan francs (RWF), which has no minor unit.

## Stack

- Laravel (PHP 8.2+)
- Laravel Sanctum for API token auth
- SQLite for local development (any supported database works in production)
- Scramble for live OpenAPI/Swagger documentation

## Install

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

If Sanctum is not yet installed in a fresh checkout:

```bash
php artisan install:api
```

Run `php artisan storage:link` so uploaded product images are served from `/storage`.

## Environment

Key `.env` values:

```dotenv
APP_NAME="UKC Animal Feed Solutions"
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=sqlite

# Payments: 'sandbox' for local testing, 'flutterwave' for real payments
PAYMENT_DRIVER=sandbox

# Mail: 'log' writes emails to storage/logs/laravel.log instead of sending
MAIL_MAILER=log
MAIL_FROM_ADDRESS="orders@ukc.rw"
MAIL_FROM_NAME="${APP_NAME}"

# Seeded admin account
ADMIN_EMAIL=admin@ukc.rw
ADMIN_PASSWORD=password
```

Run `php artisan config:clear` after changing `.env`.

## Seeded data

`php artisan migrate:fresh --seed` creates:

- Admin user from ADMIN_EMAIL / ADMIN_PASSWORD (is_admin = true)
- Category: Animal Feed (slug animal-feed)
- Feed Pellets - variable product, variants Small/Medium/Large at 400/525/650
- Fodder Silage - simple product, 120, stock 200
- Hydroponic Green Fodder - simple product, 250, stock 200

## Documentation

Live API docs (Scramble): `http://127.0.0.1:8000/docs/api`
Raw OpenAPI document: `http://127.0.0.1:8000/docs/api.json`

To send authenticated requests from the docs page, log in via `POST /api/login`,
copy the token, and paste it into the Security / Bearer token field.

## Authentication

Token-based (Sanctum). Log in or register to receive a token, then send it on
protected requests:

```
Authorization: Bearer <token>
```

Browsing the catalog and building a cart need no account. Login is required at
checkout and for reviews and all admin routes.

## Carts

Carts work for guests and logged-in users:

- A guest's first `POST /api/cart/items` creates a cart and returns a `token`.
- The guest sends that token on later cart requests as a header:
  `X-Cart-Token: <token>`
- When a guest logs in and checks out (passing the same header), the guest cart
  is claimed by their account.
- Logged-in users need no cart token; their cart is tied to their account.

## Endpoints

### Public
- POST   /api/register
- POST   /api/login
- GET    /api/products (query: search, category, sort=price_asc|price_desc|latest, per_page, page)
- GET    /api/products/{slug}
- GET    /api/products/{slug}/reviews
- GET    /api/categories
- GET    /api/categories/{slug}
- GET    /api/cart              (guest via X-Cart-Token, or logged in)
- POST   /api/cart/items        (product_id, quantity, product_variant_id?)
- PATCH  /api/cart/items/{id}   (quantity)
- DELETE /api/cart/items/{id}
- DELETE /api/cart
- GET    /api/payments/callback (browser return from gateway)
- POST   /api/payments/webhook  (gateway server-to-server)
- POST   /api/payments/simulate/{reference}  (local only; sandbox testing)

### Authenticated customer
- POST   /api/logout
- GET    /api/me
- POST   /api/checkout          (customer_name, customer_phone, customer_email?, delivery_address?)
- GET    /api/orders
- GET    /api/orders/{reference}
- POST   /api/products/{slug}/reviews    (rating 1-5, body?)
- DELETE /api/products/{slug}/reviews/{id}

### Admin (Sanctum token + admin middleware, prefix /api/admin)
- GET    /api/admin/dashboard
- GET    /api/admin/products (query: search, status)
- POST   /api/admin/products (name, type, base_price, category_id?, description?, stock?, is_active?, image?)
- GET    /api/admin/products/{slug}
- POST   /api/admin/products/{slug}/update
- DELETE /api/admin/products/{slug}
- GET    /api/admin/products/{slug}/variants
- POST   /api/admin/products/{slug}/variants (name, price, sku?, stock?)
- PATCH  /api/admin/products/{slug}/variants/{id}
- DELETE /api/admin/products/{slug}/variants/{id}
- GET    /api/admin/categories
- POST   /api/admin/categories (name, slug?, description?)
- GET    /api/admin/categories/{slug}
- PATCH  /api/admin/categories/{slug}
- DELETE /api/admin/categories/{slug}
- GET    /api/admin/orders (query: status, search)
- GET    /api/admin/orders/{reference}
- PATCH  /api/admin/orders/{reference}/status (status)
- GET    /api/admin/reviews (query: product_id)
- DELETE /api/admin/reviews/{id}

## Stock control

Each product/variant tracks `stock` (physical) and `reserved` (held by pending
orders). Available to sell = stock - reserved, exposed as `available` in the API.

- Checkout reserves stock inside a locked transaction; if any line is short, the
  whole checkout fails with 422 and no order is created (overselling guard).
- On successful payment, reserved stock is committed (both stock and reserved
  reduced).
- On failed payment or a cancelled order, the reservation is released.

## Order status

Enforced state machine (invalid transitions return 422):

- pending    -> paid, cancelled
- paid       -> processing, cancelled
- processing -> completed, cancelled
- completed  -> (final)
- cancelled  -> (final)

## Payments

The gateway sits behind a `PaymentGateway` interface, selected by
`PAYMENT_DRIVER`:

- sandbox (SandboxGateway) - no external calls; checkout returns a local
  simulate URL. For testing without keys.
- flutterwave (FlutterwaveGateway) - real cards and MTN/Airtel mobile money in
  RWF. Requires FLW_SECRET_KEY and FLW_WEBHOOK_SECRET.

Payment flow: checkout creates an Order (pending) and a Payment, then returns a
`checkout_url`. The client sends the buyer there. The gateway confirms via
webhook (source of truth); the browser callback re-verifies server-side. On
confirmation the order is marked paid, stock is committed, and notifications are
sent. Marking paid is idempotent.

To swap in another gateway (for example Paypack for Rwandan mobile money),
implement `PaymentGateway` in a new class and add one arm to the match in
`PaymentServiceProvider`. No controller changes are needed.

### Sandbox test flow

1. POST /api/checkout -> returns checkout_url and an order reference
2. POST /api/payments/simulate/{reference} -> marks the order paid

## Notifications

On successful payment:

- The customer receives an order confirmation (if an email was provided).
- All admin users receive a new-paid-order alert.

With `MAIL_MAILER=log`, emails are written to `storage/logs/laravel.log` instead
of being sent. For real delivery, set SMTP credentials from a mail service
(Brevo, Mailgun, Resend, etc.) and verify the sending domain (SPF/DKIM). An SMS
channel can be added later to the notification `via()` methods without changing
the trigger.

## Remaining setup for production

- Brand the emails (publish mail templates, add the UKC logo and colours)
- Add real payment keys (Flutterwave, or a Paypack driver for local MoMo)
- Add product images (admin upload, or seed image URLs)
- Configure a real mailer and verify the UKC sending domain
- Restrict the Scramble docs and the simulate route outside local
