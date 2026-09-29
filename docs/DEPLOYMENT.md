# Production Deployment Guide — ApexCart

This guide explains how to build, containerize, and deploy ApexCart to production environments (AWS, Railway, Render, Fly.io, Vercel, or VPS with Docker).

---

## 1. Production Build

Build both the frontend client and backend server using the monorepo root command:

```bash
npm run build
```

This compiles:
- `server/dist/`: Production Node.js CommonJS bundles with TypeScript types.
- `client/dist/`: Minified, code-split static assets with compressed CSS and JS.

---

## 2. PostgreSQL Configuration

In production, point your `DATABASE_URL` to a hosted PostgreSQL instance (e.g., Neon, Supabase, AWS RDS, Railway):

```bash
DATABASE_URL="postgresql://user:password@host:5432/apexcart_prod?sslmode=require&schema=public"
```

Apply migrations and generate client:
```bash
# In server workspace:
npm run prisma:generate
npx prisma migrate deploy --schema=../prisma/schema.postgresql.prisma
```

---

## 3. Docker Deployment (`docker-compose.yml`)

ApexCart can be run via Docker with a standard container setup:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secure_db_password
      POSTGRES_DB: apexcart_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  api:
    build:
      context: .
      dockerfile: Dockerfile
    restart: always
    environment:
      NODE_ENV: production
      PORT: 5000
      DATABASE_URL: postgresql://postgres:secure_db_password@postgres:5432/apexcart_db?schema=public
      JWT_SECRET: production_jwt_secret_min_32_characters_long
      CLIENT_URL: https://yourdomain.com
    ports:
      - "5000:5000"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

---

## 4. Environment Variables Checklist

Ensure these production secrets are supplied via your cloud platform:

| Secret | Description | Required |
|---|---|---|
| `NODE_ENV` | Must be `production` | Yes |
| `DATABASE_URL` | PostgreSQL connection string with SSL | Yes |
| `JWT_SECRET` | 32+ character random hex string | Yes |
| `JWT_REFRESH_SECRET` | 32+ character random hex string | Yes |
| `CLIENT_URL` | Deployed domain (for CORS origin validation) | Yes |
| `RAZORPAY_KEY_ID` | Production Razorpay key | For Payments |
| `RAZORPAY_KEY_SECRET`| Production Razorpay secret | For Payments |
