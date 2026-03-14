# Thrift Marketplace Fullstack (Recloth)

A modern, high-performance C2C (Consumer-to-Consumer) Marketplace and Swap Platform for Premium Thrifting. This project features a clean, minimalist aesthetic inspired by H&M.

## Project Structure
- **/recloth-fe**: Frontend built with Next.js 15, Tailwind CSS 4, and Zustand.
- **/recloth-be**: Backend API built with Laravel 11, Sanctum, and Reverb (Websockets).
- **api.yaml**: OpenAPI 3.0 Documentation for the system.

## Main Features
- **Premium Shop**: Curated catalog with advanced filtering.
- **Real-time Chat**: Fully integrated chat system with delivery status indicators.
- **Product Swap**: Unique barter system with state-managed request flow.
- **Secure Payment**: Integrated with Midtrans for seamless transactions.
- **Wallet System**: In-app balance, top-ups, and secure withdrawals.
- **Seller Dashboard**: Comprehensive stats and inventory management.

## Rapid Setup
The project includes automated scripts for quick initialization:

1. **Install All**: Run `setup.bat` (Installs both FE and BE dependencies).
2. **Start All**: Run `run-all.bat` (Starts API, Websockets, and Frontend).

## Environment Configuration
Ensure you have the following environment variables configured:
- **Backend (`recloth-be/.env`)**: DB credentials, Midtrans keys, and Reverb config.
- **Frontend (`recloth-fe/.env.local`)**: `NEXT_PUBLIC_API_URL` and Pusher/Reverb keys.

## API Documentation
Refer to [api.yaml](./api.yaml) for a detailed list of all endpoints, parameters, and authentication requirements.
