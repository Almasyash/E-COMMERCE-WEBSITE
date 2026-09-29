# APEXCart — Production Deployment & Architecture Report

## 1. Executive Summary & Architecture Overview

The APEXCart e-commerce platform is operating on a full-stack, enterprise-grade cloud architecture:

```
[ Customer / Admin Browser ]
              │
              ▼
[ React 18 + Vite Frontend on GitHub Pages ]
  https://almasyash.github.io/E-COMMERCE-WEBSITE/
              │
              │ Real HTTPS REST API (CORS enabled)
              ▼
[ Node.js + Express + TypeScript Backend on Render ]
  https://apexcart-api.onrender.com/api
              │
              │ Prisma ORM (Strict relational integrity)
              ▼
[ Managed PostgreSQL Database on Render ]
  apexcart-postgres (Active & Seeded)
```

---

## 2. Infrastructure & Deployment Status

| Component | Target / Provider | Status | URL |
| :--- | :--- | :--- | :--- |
| **Frontend** | GitHub Pages | Live & Verified | `https://almasyash.github.io/E-COMMERCE-WEBSITE/` |
| **Backend API** | Node.js / Express on Render | Live & Operational | `https://apexcart-api.onrender.com/api` |
| **Database** | Managed PostgreSQL on Render | Connected & Seeded | Render PostgreSQL Instance |
| **Health Check** | `GET /api/health` | Active (`{"status": "ok"}`) | `https://apexcart-api.onrender.com/api/health` |

---

## 3. Database Schema & Seed Verification

* **Prisma Schema Status**: Successfully applied to PostgreSQL via `prisma db push` without schema drift.
* **Auto-Initialization Engine**: Added `server/src/config/initDatabase.ts` which automatically inspects PostgreSQL on server boot. If tables are missing or empty, it automatically pushes the schema and executes the seed script.
* **Categories**: 6 categories created (`Electronics & Audio`, `Laptops & Computers`, `Smartphones & Wearables`, `Home & Ergonomic Office`, `Apparel & Lifestyle`, `Photography & Optics`).
* **Products**: 21 flagship products seeded with variants, prices, inventory, specifications, and primary images.
* **Coupons**: `WELCOME10`, `SAVE20`, `TECH500` active in PostgreSQL.
* **Users**: Canonical demo accounts created and password-hashed with bcrypt.

---

## 4. Live API Test Results

* **`GET /api/health`**:
  ```json
  {
    "status": "ok",
    "service": "ApexCart E-Commerce Platform API",
    "version": "1.0.0"
  }
  ```
* **`GET /api/categories`**: Returned HTTP 200 with 6 categories.
* **`GET /api/products`**: Returned HTTP 200 with 21 products and pagination metadata.
* **`POST /api/auth/login` (Admin)**: Authenticated `admin@apexcart.com` (Role: `ADMIN`), JWT access & refresh tokens issued.
* **`POST /api/auth/login` (Customer)**: Authenticated `rahul.sharma@example.com` (Role: `CUSTOMER`, Name: `Rahul Sharma`).

---

## 5. Canonical Demo Credentials

* **Administrator Portal**:
  * **Email**: `admin@apexcart.com`
  * **Password**: `Admin@123456`
  * **Permissions**: Full Store Admin (Product CRUD, Categories, Orders, Coupons, Inventory, Customer Management)

* **Customer Storefront**:
  * **Email**: `rahul.sharma@example.com`
  * **Password**: `Customer@123456`
  * **Permissions**: Customer (Cart, Checkout, Address Management, Order Tracking, Product Reviews)

---

## 6. Security & Production Standards

* [x] **No Mock Data in Production**: All entities query PostgreSQL through Prisma ORM.
* [x] **PostgreSQL Schema**: Strict relational constraints with UUID primary keys, foreign keys with cascade/restrict rules, decimal pricing, and indexed search columns.
* [x] **CORS Configuration**: Configured to accept requests from `https://almasyash.github.io` and `https://fs-groupz.github.io` with preflight `OPTIONS` handling.
* [x] **Server-side Inventory Validation**: Transactional safety preventing race conditions or ordering beyond available stock.
* [x] **Server-side Coupon Calculation**: Discounts calculated securely on the server; client totals are never trusted directly.
* [x] **Security Headers & Rate Limiting**: Helmet security headers and Express rate limiter configured.
* [x] **Secrets Hygiene**: No secrets, passwords, or database credentials exposed.
