# APEXCart — Production Deployment & Architecture Report

## 1. Executive Summary & Architecture Overview

The APEXCart e-commerce platform has been transitioned to a full-stack, enterprise-grade architecture:

```
[ Customer / Admin Browser ]
              │
              ▼
[ React 18 + Vite Frontend on GitHub Pages ]
  https://almasyash.github.io/E-COMMERCE-WEBSITE/
              │
              │ Real HTTPS REST API (CORS enabled)
              ▼
[ Node.js + Express + TypeScript Backend ]
  Target: Render Web Service (apexcart-api)
              │
              │ Prisma ORM (Strict relational integrity)
              ▼
[ Managed PostgreSQL Database ]
  Target: Render PostgreSQL (apexcart-postgres)
```

---

## 2. Infrastructure & Deployment Status

| Component | Target / Provider | Status | URL |
| :--- | :--- | :--- | :--- |
| **Frontend** | GitHub Pages | Prepared & Verified | `https://almasyash.github.io/E-COMMERCE-WEBSITE/` |
| **Backend API** | Node.js / Express (Render Blueprint) | Blueprint Configured (`render.yaml`) | Pending Service URL from Render |
| **Database** | Managed PostgreSQL (Render / Neon) | PostgreSQL Schema (`schema.prisma`) | Managed Instance |
| **Health Check** | `GET /api/health` | Implemented (`status: "ok"`) | Ready for validation |

---

## 3. Mock Backend Removal Verification

* **`client/src/services/mockBackend.ts`**: Completely removed from codebase.
* **`client/src/data/mockDatabase.json`**: Completely removed from codebase.
* **`server/src/exportMockData.ts`**: Completely removed from codebase.
* **`client/src/services/api.ts`**: Refactored to pure Axios HTTP client sending requests directly to `VITE_API_URL`. All mock intercepts and localStorage fallbacks have been removed.

---

## 4. Canonical Demo Credentials

To maintain strict data consistency between the PostgreSQL database and storefront UI, the canonical credentials are:

* **Administrator Portal**:
  * **Email**: `admin@apexcart.com`
  * **Password**: `Admin@123456`
  * **Permissions**: Full Store Admin (Product CRUD, Categories, Orders, Coupons, Inventory, Customer Management)

* **Customer Storefront**:
  * **Email**: `rahul.sharma@example.com`
  * **Password**: `Customer@123456`
  * **Permissions**: Customer (Cart, Checkout, Address Management, Order Tracking, Product Reviews)

---

## 5. Security & Production Checklist

* [x] **No Mock Data in Production**: All entities (products, users, orders, coupons, inventory) query PostgreSQL through Prisma.
* [x] **PostgreSQL Schema**: Strict relational constraints with UUID primary keys, foreign keys with cascade/restrict rules, decimal pricing, and indexed search columns.
* [x] **CORS Configuration**: Configured to accept requests from `https://almasyash.github.io` and `https://fs-groupz.github.io` with preflight `OPTIONS` handling.
* [x] **Server-side Inventory Validation**: Transactional safety preventing race conditions or ordering beyond available stock.
* [x] **Server-side Coupon Calculation**: Discounts calculated securely on the server; client totals are never trusted directly.
* [x] **Security Headers & Rate Limiting**: Helmet security headers and Express rate limiter configured.
* [x] **Secrets Hygiene**: No secrets or passwords committed to Git. `.env.example` provides template configurations.
