# Recloth: Premium C2C Marketplace & Swap Platform

Recloth is a high-performance, minimalist C2C marketplace designed for the premium thrifting community. Inspired by the clean aesthetics of H&M, it offers a seamless experience for buying, selling, and swapping (bartering) preloved fashion items.

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4 (Custom minimalist theme)
- **State Management**: Zustand & React Query (@tanstack/react-query)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form & Zod
- **API Client**: Axios with interceptors

### Backend
- **Framework**: Laravel 11
- **Auth**: Laravel Sanctum (SPA & API)
- **Real-time**: Laravel Reverb (Websockets)
- **Admin CMS**: Filament v3 (Super Admin Panel)
- **Database**: MySQL / MariaDB
- **Search**: Laravel Scout (Database engine)
- **Storage**: Amazon S3 (compatible local storage)
- **Payment Gateway**: Midtrans Integration

## ✨ Key Features

### 🛍️ Premium Shopping Experience
- **Responsive Grid**: 3-column layout (Desktop), 2-column (Tablet), 1-column (Mobile).
- **Infinite Scroll**: Seamless "Load More" pagination for product discovery.
- **Search & Filter**: Keyword search and category-based filtering.
- **Product Detail**: Detailed condition badges, size info, and store linking.

### 🔄 Unique Swap (Barter) System
- **Request Flow**: Propose a swap for any product using your own items.
- **Counter Offers**: Real-time negotiation for swaps.
- **Escrow Guard**: Funds/items held securely until both parties confirm delivery.

### 💬 Real-time Communication
- **Messenger**: Instant chat between buyers and sellers.
- **Status Indicators**: Read receipts, delivery status, and online presence.

### 💳 Financial Ecosystem
- **Wallet**: Check balance, view transaction history (Payment, Top-up, Withdrawal).
- **Midtrans**: Checkout via QRIS, Virtual Accounts, and Bank Transfer.
- **Admin CMS**: Manage users, products, categories, and withdrawals from a powerful backend.

## 🛠️ Rapid Setup

Initialize the entire stack with minimal effort:

1. **Setup All**: Run `setup.bat` (Installs all FE/BE dependencies).
2. **Launch Services**: Run `run-all.bat` (Starts Laravel, Reverb, and Next.js).
3. **Database Reset**: Run `php artisan migrate:fresh --seed` (Creates fresh data with demo users).

## 🔑 Demo Accounts

Use these credentials to explore the platform (Password: `password`):

- **Premium Account (Recommended)**: `penjual@recloth.id`
  *Access to Seller Dashboard, Multi-item management, and standard buying features.*
- **Buyer Account**: `pembeli@recloth.id`
  *Standard browsing, checkout, and swap request experience.*
- **Super Admin**: `admin@recloth.id`
  *Access the control center at `http://localhost:8000/admin`.*

## 📂 Project Structure
- `/recloth-fe`: Modern Next.js application.
- `/recloth-be`: RESTful Laravel API.
- `api.yaml`: Full API contract and documentation.

---
Built with ❤️ for the Recloth Community.
