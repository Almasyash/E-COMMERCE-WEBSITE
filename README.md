# ApexCart — Production-Ready Full-Stack E-Commerce Platform

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.6-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-teal.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20SQLite-indigo.svg)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-sky.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-purple.svg)](LICENSE)

**ApexCart** is an enterprise-grade, modern, fully responsive e-commerce web platform engineered for extreme performance, security, and scalability. Built with **React 18**, **TypeScript**, **Tailwind CSS**, **Node.js**, **Express**, and **Prisma ORM** supporting both **PostgreSQL** and zero-config local SQLite development.

---

## 🌟 Key Highlights & Features

### 🛍️ Customer Experience
- **Dynamic Modern Storefront**: Announcement bar, responsive navbar, hero section, curated categories, flagship carousels, best sellers, customer benefits, testimonials, and newsletter.
- **Product Catalog & Multi-Filters**: Filter by category, price slider, brand, customer rating, and real-time stock availability. Sort by relevance, newest, price asc/desc, highest rated, and best selling.
- **Product Deep Dive**: High-resolution image gallery, variant selection (color/size/capacity), stock badges, technical specifications matrix, and verified purchaser reviews.
- **Persistent Shopping Cart**: Cross-session and guest cart support, item quantity modifiers, stock protection, free-shipping progress tracker, and server-validated promo coupons.
- **Multi-Step Checkout**: 4-step streamlined checkout (Customer Details → Shipping Address → Payment Gateway → Review & Confirm) designed for seamless integration with **Razorpay**, UPI, Cards, and Cash on Delivery (COD).
- **Order Timeline & Tracking**: Live shipment timeline tracking from confirmation to doorstep delivery, tracking numbers, and cancellation workflows with automatic inventory restocking.
- **Customer Portal**: Profile management, multiple shipping addresses with default address designation, order history, and saved wishlist.
- **Instant Search**: Debounced live search autocomplete suggestions modal with quick click-through previews.

### 🛡️ Administrative Capabilities
- **Executive Analytics Dashboard**: Gross revenue metrics, order volumes, customer acquisition stats, low-stock warnings, and monthly sales overview charts.
- **Complete Product Management**: Create, edit, publish/unpublish, manage variant SKUs, set sale prices, and manage inventory thresholds.
- **Taxonomy & Category Manager**: Create hierarchical catalog groupings with slugs and product counters.
- **Fulfillment & Order Control**: Filter orders by status, update courier tracking AWB numbers, update payment states, and view buyer contact snapshots.
- **Coupon & Promotion Engine**: Create percentage or fixed-amount discount coupons with minimum order values, maximum discount caps, usage limits, and per-user frequency limits.
- **Review Moderation**: Approve or hide buyer reviews, delete spam, and automatically recalculate product rating aggregates.
- **Customer Directory**: Inspect registered customer activity and toggle account activation status.

---

## 🏗️ Architecture Overview

```text
E-COMMERCE-WEBSITE/
├── client/                     # Frontend Application (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/         # Reusable UI components & drawers
│   │   ├── layouts/            # RootLayout & AdminLayout
│   │   ├── pages/              # Customer & Admin pages
│   │   ├── routes/             # AppRoutes configuration
│   │   ├── services/           # Axios API services
│   │   ├── stores/             # Zustand state management
│   │   ├── types/              # Comprehensive TypeScript interfaces
│   │   └── utils/              # Currency formatters & status helpers
│   ├── index.html
│   └── vite.config.ts
│
├── server/                     # Backend REST API (Node.js + Express + Prisma)
│   ├── src/
│   │   ├── config/             # DB & environment variables
│   │   ├── controllers/        # Express route controllers
│   │   ├── middleware/         # Auth, RBAC, Validation & Rate limiting
│   │   ├── routes/             # Express API routers
│   │   ├── services/           # Business logic & DB transactions
│   │   ├── utils/              # ApiError, ApiResponse & JWT helpers
│   │   ├── validators/         # Zod request validation schemas
│   │   ├── app.ts              # Express application factory
│   │   └── server.ts           # Graceful server entrypoint
│   └── package.json
│
├── prisma/                     # Database Schema & Seed Data
│   ├── schema.prisma           # Active Prisma schema
│   ├── schema.postgresql.prisma# PostgreSQL production schema (with Decimals & Enums)
│   ├── schema.sqlite.prisma    # SQLite local dev schema (zero-dependency)
│   └── seed.ts                 # 20+ realistic products, categories, coupons, & users
│
├── docs/                       # Comprehensive documentation
│   ├── ARCHITECTURE.md         # System design & architecture details
│   ├── DATABASE.md             # Schema, ER diagram & relations
│   ├── API.md                  # REST API endpoints reference
│   ├── SETUP.md                # Local developer setup guide
│   ├── DEPLOYMENT.md           # Production Docker & Cloud deployment
│   ├── SECURITY.md             # Security policies & audits
│   └── TESTING.md              # Unit & integration testing guide
│
├── .env.example                # Sample environment configuration
└── package.json                # Monorepo root scripts
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/FS-Groupz/E-COMMERCE-WEBSITE.git
cd E-COMMERCE-WEBSITE
npm install
```

### 3. Database Initialization & Seeding
The database comes pre-configured with a local SQLite database for instant zero-dependency testing, and a PostgreSQL schema for production.

To initialize and seed the database with **20+ realistic products, admin account, customer accounts, and coupons**:
```bash
npm run prisma:generate
npm run prisma:seed
```

### 4. Running the Development Server
Start both the Express backend API (`http://localhost:5000`) and the Vite React frontend (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

Visit **`http://localhost:5173`** in your browser!

---

## 🔑 Demo Login Credentials

The seed script creates the following pre-configured accounts:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Administrator** | `admin@apexcart.com` | `Admin@123456` | Full Admin Dashboard & Storefront |
| **Customer** | `rahul.sharma@example.com` | `Customer@123456` | Storefront, Wishlist, Orders, Checkout |
| **Customer 2** | `priya.patel@example.com` | `Customer@123456` | Storefront & Checkout |

---

## 🧪 Testing

Run the automated integration and unit test suite:
```bash
npm run test
```

All 19 core test suites covering Authentication, Role-based Access Control, Inventory Safeguards, Server-side Coupon Logic, and Atomic Checkout will execute with Vitest.

---

## 📚 Detailed Documentation

For in-depth explanations, consult the guides in `/docs`:
- [Architecture & Design Decisions](docs/ARCHITECTURE.md)
- [Database Schema & Models](docs/DATABASE.md)
- [API Reference Guide](docs/API.md)
- [Local Setup & Configuration](docs/SETUP.md)
- [Production Deployment](docs/DEPLOYMENT.md)
- [Security Architecture](docs/SECURITY.md)
- [Testing & Quality Assurance](docs/TESTING.md)

---

## 📄 License
This project is licensed under the MIT License.
