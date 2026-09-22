# UKC Platform (URUHIMBIKAGEYO LTD)

UKC Platform is a full-stack e-commerce solution built for **URUHIMBIKAGEYO LTD** to provide sustainable animal feed solutions, including premium hydroponic fodder, feed pellets, and agricultural services.

The platform is split into two parts:
1. **Frontend**: A modern, responsive web application built with **Next.js**, **React**, and **Tailwind CSS**.
2. **Backend**: A robust REST API built with **Laravel**, utilizing **MySQL** for data storage and **Sanctum**  authentication.

---

## Features

- 🛒 **E-Commerce Shop**: Browse featured products, filter by categories, and sort by price or popularity.
- 🔐 **User Authentication**: Secure login and registration using Laravel Sanctum (cookie-based stateful authentication).
- 🛍️ **Shopping Cart**: Real-time cart synchronization between local state and the database.
- 💳 **Checkout System**: Integrated checkout process with support for Mobile Money (MOMO) and Flutterwave.
- 📱 **Responsive Design**: fully optimized for mobile and desktop screens with a beautiful Dark/Light mode toggle.
- 📚 **API Documentation**: Auto-generated OpenAPI/Swagger documentation for the backend (powered by Scramble).

---

## Tech Stack

**Frontend:**
- [Next.js](https://nextjs.org/) (Turbopack)
- [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

**Backend:**
- [Laravel 11+](https://laravel.com/)
- [MySQL 8+](https://www.mysql.com/)
- [Laravel Sanctum](https://laravel.com/docs/sanctum) (SPA Authentication)

---

## Getting Started

To run this project locally, you will need to set up both the backend API and the frontend application.

### Prerequisites
- PHP 8.2+ and Composer
- Node.js 18+ and npm
- MySQL Server

---

### 1. Backend Setup

Open a terminal and navigate to the `Backend` directory:

```bash
cd Backend
```

**Install dependencies:**
```bash
composer install
```

**Configure environment variables:**
Copy the example environment file and create your own `.env`:
```bash
cp .env.example .env
```
Open `.env` and configure your database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ukc_platform
DB_USERNAME=root
DB_PASSWORD=your_password

# CORS & SPA Auth Settings
FRONTEND_URL=http://localhost:3000
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
```

**Generate Application Key & Migrate Database:**
```bash
php artisan key:generate
php artisan migrate --seed
```
*(Note: If you don't have a database named `ukc_platform`, create it in your MySQL client before migrating).*

**Start the Laravel Server:**
```bash
php artisan serve
```
The backend API will now be running at `http://localhost:8000`. 
*You can view the API documentation at `http://localhost:8000/docs/api`.*

---

### 2. Frontend Setup

Open a new terminal window and navigate to the `frontend` directory:

```bash
cd frontend
```

**Install dependencies:**
```bash
npm install
```

**Configure environment variables:**
Create a `.env.local` file in the `frontend` directory:
```bash
cp .env.example .env.local
```
Add the backend API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Start the Next.js Development Server:**
```bash
npm run dev
```
The frontend will now be running at `http://localhost:3000`.

---

## Folder Structure Overview

```text
ukc-platform/
│
├── Backend/                 # Laravel Application
│   ├── app/                 # Models, Controllers, Resources
│   ├── routes/              # api.php, web.php
│   ├── database/            # Migrations, Seeders
│   └── config/              # cors.php, sanctum.php
│
└── frontend/                # Next.js Application
    ├── app/                 # Next.js App Router (Pages, Layouts)
    │   ├── auth/            # Login & Register pages
    │   ├── components/      # Reusable UI components & Contexts
    │   ├── lib/             # API client (api.ts) & Auth logic (auth.tsx)
    │   └── products/        # Product listing & details pages
    ├── public/              # Static assets (images, icons)
    └── postcss.config.js    # Tailwind configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request