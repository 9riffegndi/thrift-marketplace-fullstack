# 👔 Recloth Project Documentation

## Project Overview
Recloth is a specialized C2C Marketplace and Swapping platform for high-end second-hand fashion. Inspired by minimalist design systems, it provides a premium experience for users to buy, sell, or barter their clothing items.

## Table of Contents
1. [Core Modules](#core-modules)
2. [Tech Stack Deep Dive](#tech-stack-deep-dive)
3. [Financial Flow (Escrow)](#financial-flow-escrow)
4. [Routing & Navigation](#routing--navigation)
5. [Database Schema](#database-schema)

---

## Core Modules
- **Discovery**: Fast searching with keyword matching and category filters.
- **Transactions**: Multi-payment support via Midtrans and internal Wallet.
- **Barter (Swap)**: Bidirectional request system with mutual confirmation.
- **Communication**: Real-time messaging with delivery receipts.
- **Seller Tools**: Inventory management, sales analytics, and order fulfillment.

## Tech Stack Deep Dive
### Frontend
- **Framework**: Next.js 16.1.6 (Turbopack enabled)
- **Library**: React 19.2.3
- **State**: Zustand & TanStack Query (Infinite scrolling implementation)
- **Messaging**: Laravel Echo + Pusher (via Reverb)

### Backend
- **Core**: Laravel 12.0.0
- **Admin**: Filament 3.2+
- **Security**: Laravel Sanctum for API token management.
- **Real-time**: Laravel Reverb for websocket orchestration.

## Financial Flow (Escrow)
To protect both buyers and sellers, Recloth uses an **Escrow Service**:
1. **Payment**: Funds from the buyer are recorded but not released.
2. **Holding**: The `escrow_status` is set to `held`.
3. **Fulfillment**: Seller ships the item and inputs the tracking number.
4. **Completion**: Once the buyer confirms delivery, the funds are released to the seller's wallet.

## Routing & Navigation
- `/`: Home / Product Catalog
- `/cari`: Advanced Search
- `/keranjang`: Shopping Cart
- `/checkout`: Payment Entry
- `/pesanan`: Order History & Tracking
- `/seller`: Seller Dashboard & Product Management

## Database Schema
The system relies on several key tables:
- `users`: Core identity and role management.
- `products`: Product metadata, grading (A-D), and status.
- `orders`: Transaction headers with escrow tracking.
- `wallet_transactions`: Ledger for all financial movements.
- `swaps`: Records for barter invitations and status.

---
*Documentation updated: March 2026*
