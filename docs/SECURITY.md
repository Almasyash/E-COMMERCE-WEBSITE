# Security Architecture & Safeguards — ApexCart

ApexCart was designed with strict security principles to safeguard sensitive customer data, prevent monetary exploits, and protect against OWASP Top 10 vulnerabilities.

---

## 1. Authentication & Password Security

- **Bcrypt Hashing**: Passwords are never stored in plaintext. They are salted with 10 salt rounds using `bcryptjs`.
- **JWT Architecture**:
  - Stateless Access Tokens (expires in 7 days).
  - Refresh Tokens (expires in 30 days) to refresh access without requiring re-login.
  - Revocation: User accounts can be deactivated by admins, which invalidates all subsequent authenticated requests immediately at the middleware layer.

---

## 2. Authorization & RBAC

- Roles are enforced via the `requireRole(['ADMIN'])` middleware.
- Regular customers attempting to query `/api/admin/*` receive an immediate `403 Forbidden` response.
- Customer endpoints ensure that users can only access and cancel **their own** orders (`where: { id: orderId, userId }`).

---

## 3. Server-Side Calculations & Financial Integrity

- **Never Trust Client Calculations**: All subtotal, coupon discount, GST taxes, and grand total calculations happen exclusively on the backend inside transactional boundaries.
- **Stock Protection**: Inventory is decremented inside a database transaction (`prisma.$transaction`). If another concurrent user purchases the last unit, the transaction aborts with an informative error rather than allowing negative inventory.
- **Coupon Limits**: Enforces global usage limits and per-user limits to prevent replay attacks.

---

## 4. Network & HTTP Defenses

- **Helmet.js**: Sets security HTTP headers (X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security).
- **CORS Protection**: Access is restricted to trusted client domains (`CLIENT_URL`).
- **Rate Limiting**:
  - Global API: Maximum 300 requests per 15-minute window per IP.
  - Auth Endpoints (`/api/auth/*`): Maximum 20 attempts per 15 minutes to defeat brute-force dictionary attacks.
- **Input Validation**: All incoming request payloads (`body`, `query`, `params`) are parsed against strict **Zod schemas**. Malformed data is rejected with a `400 Bad Request` before invoking business logic.
- **SQL Injection Prevention**: Prisma ORM executes parameterized queries for all operations, making traditional SQL injection impossible.
