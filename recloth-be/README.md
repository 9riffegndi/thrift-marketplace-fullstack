# Recloth - Backend API

Robust Laravel-based API for a premium C2C Marketplace.

## Tech Stack
- **Framework**: Laravel 11
- **Database**: PostgreSQL / MySQL
- **Real-time**: Laravel Reverb (Websockets)
- **Payment**: Midtrans Integration
- **Auth**: Laravel Sanctum

## Features
- Multi-vendor Store Management
- Product Discovery & Advanced Search
- Real-time Chat (Pusher-compatible)
- Secure Checkout with Midtrans Payment Gateway
- Wallet & Withdrawal System
- Swap (Barter) Management Flow

## Installation
1. `composer install`
2. `cp .env.example .env`
3. `php artisan key:generate`
4. `php artisan migrate --seed`

## Running
```bash
# Start API
php artisan serve

# Start WebSockets
php artisan reverb:start

# Start Queue (for notifications/emails)
php artisan queue:work
```
