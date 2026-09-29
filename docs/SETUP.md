# Developer Setup Guide — ApexCart

This guide will walk you through setting up ApexCart locally on your machine.

---

## 1. System Requirements

- **Operating System**: macOS, Linux, or Windows 10/11
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Git**: Installed and configured

---

## 2. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/FS-Groupz/E-COMMERCE-WEBSITE.git
cd E-COMMERCE-WEBSITE

# Install root, server, and client packages in one command
npm install
```

---

## 3. Environment Configuration

Copy `.env.example` to `server/.env`:

```bash
# Windows PowerShell:
Copy-Item .env.example server/.env

# macOS / Linux:
cp .env.example server/.env
```

Review `server/.env` parameters:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database URL
DATABASE_URL="file:./dev.db"

# JWT Secrets
JWT_SECRET=super_secret_jwt_key_production_change_this_min_32_chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=super_secret_refresh_jwt_key_production_change_this
JWT_REFRESH_EXPIRES_IN=30d
```

---

## 4. Database Setup & Seeding

ApexCart includes a comprehensive seed script with 20+ realistic products, variants, images, users, coupons, and orders.

```bash
# Generate Prisma Client
npm run prisma:generate

# Seed the database
npm run prisma:seed
```

---

## 5. Launch Development Servers

Run both the Express backend (`http://localhost:5000`) and the Vite React frontend (`http://localhost:5173`) concurrently:

```bash
npm run dev
```

Open **`http://localhost:5173`** in your browser.

---

## 6. Default User Credentials

| Account | Email | Password |
|---|---|---|
| **Store Administrator** | `admin@apexcart.com` | `Admin@123456` |
| **Demo Customer 1** | `rahul.sharma@example.com` | `Customer@123456` |
| **Demo Customer 2** | `priya.patel@example.com` | `Customer@123456` |
