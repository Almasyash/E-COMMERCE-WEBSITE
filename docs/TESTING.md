# Testing & Quality Assurance Guide — ApexCart

This guide explains the automated testing architecture, test coverage, and execution instructions.

---

## 1. Test Architecture

The testing suite utilizes **Vitest** combined with **Supertest** to execute full-pipeline HTTP integration tests against the Express application and Prisma database.

Test Suite Location:
`server/src/__tests__/ecommerce.test.ts`

---

## 2. Test Coverage Matrix

The automated test suite verifies 100% of the core critical business requirements:

| Test Group | Test Case | Expected Outcome |
|---|---|---|
| **1. Authentication** | Admin Login | Issues JWT with role `ADMIN` |
| | Customer Login | Issues JWT with role `CUSTOMER` |
| | Protected Endpoint Access | Rejects unauthenticated requests with `401` |
| | RBAC Enforcement | Blocks non-admin users from admin routes with `403` |
| | Admin Access | Allows valid admin access to `/api/admin/dashboard-stats` |
| **2. Catalog & Search** | Product Pagination | Returns paginated array with total count |
| | Keyword Filtering | Returns only products matching search term |
| | Category Filtering | Filters products by category slug |
| | Price Sorting | Sorts results ascending/descending |
| | Autocomplete Suggestions | Returns fast thumbnail & keyword matches |
| **3. Cart & Inventory** | Add Item to Cart | Increments cart subtotal and calculates taxes |
| | Stock Validation | Rejects quantities exceeding physical inventory |
| | Retrieve User Cart | Persists cart state across sessions |
| **4. Coupon Engine** | Active Coupon | Accurately calculates percentage/fixed discount |
| | Invalid Coupon | Returns `400 Bad Request` |
| | Minimum Order Guard | Rejects coupon when subtotal is below minimum order value |
| **5. Checkout & Orders**| Atomic Order Creation | Creates order, deducts stock, records payments |
| | Order History | Returns customer's past orders |
| | Order Cancellation | Cancels eligible order and restores inventory |

---

## 3. Running Automated Tests

Run the test suite from the root folder or within `server/`:

```bash
# From repository root:
npm run test

# Or within server folder:
cd server
npm run test
```

### Expected Output:
```text
 ✓ src/__tests__/ecommerce.test.ts (19 tests)
 Test Files  1 passed (1)
      Tests  19 passed (19)
```
