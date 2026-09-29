# REST API Reference Documentation — ApexCart

Base URL: `http://localhost:5000/api`

All requests expecting JSON must set `Content-Type: application/json`.
Protected routes require the `Authorization: Bearer <accessToken>` header.
Guest shopping sessions pass `X-Session-Id: <sessionId>`.

---

## 1. Authentication & User Profile (`/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register a new customer account |
| `POST` | `/auth/login` | Public | Authenticate with email/password; returns JWT tokens |
| `POST` | `/auth/refresh` | Public | Issue fresh access token using valid refresh token |
| `GET` | `/auth/me` | Authenticated | Retrieve current user profile and saved addresses |
| `PUT` | `/auth/me` | Authenticated | Update user name, phone, or avatar |
| `POST` | `/auth/addresses` | Authenticated | Add a new shipping/billing address |
| `PUT` | `/auth/addresses/:id` | Authenticated | Update an existing address |
| `DELETE` | `/auth/addresses/:id`| Authenticated | Delete a saved address |

---

## 2. Product Catalog (`/products` & `/categories`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/products` | Public | Query catalog with filtering, sorting, and pagination |
| `GET` | `/products/suggestions` | Public | Fast autocomplete suggestions for live search |
| `GET` | `/products/:slug` | Public | Retrieve full product details, variants, images, and reviews |
| `GET` | `/products/:id/related` | Public | Fetch recommended items in same category |
| `POST` | `/products` | Admin Only | Create a new product with variants and inventory |
| `PUT` | `/products/:id` | Admin Only | Update an existing product |
| `DELETE` | `/products/:id` | Admin Only | Remove product from catalog |
| `GET` | `/categories` | Public | Retrieve active categories with product counts |
| `POST` | `/categories` | Admin Only | Create a new catalog category |
| `DELETE` | `/categories/:id` | Admin Only | Delete category |

---

## 3. Cart & Wishlist (`/cart` & `/wishlist`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/cart` | Public / Auth | Get cart items, subtotal, shipping fee, tax, and total |
| `POST` | `/cart/items` | Public / Auth | Add product or variant to cart with stock validation |
| `PUT` | `/cart/items/:itemId` | Public / Auth | Update item quantity in cart |
| `DELETE` | `/cart/items/:itemId`| Public / Auth | Remove item from cart |
| `DELETE` | `/cart/clear` | Public / Auth | Clear all items from cart |
| `POST` | `/cart/merge` | Authenticated | Merge guest session items into logged-in user cart |
| `GET` | `/wishlist` | Authenticated | Retrieve saved wishlist items |
| `POST` | `/wishlist/toggle` | Authenticated | 1-Click toggle product in wishlist |

---

## 4. Checkout & Orders (`/orders`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/orders/checkout` | Authenticated | Process multi-step order checkout and deduct inventory atomically |
| `GET` | `/orders/my-orders` | Authenticated | Retrieve customer order history |
| `GET` | `/orders/:id` | Authenticated | View order invoice, tracking timeline, and items |
| `POST` | `/orders/:id/cancel` | Authenticated | Cancel order in eligible status; restocks inventory |
| `GET` | `/orders/admin/all` | Admin Only | List all store orders with search and status filters |
| `PATCH` | `/orders/admin/:id/status`| Admin Only | Update order status and courier tracking AWB number |

---

## 5. Promotions & Coupons (`/coupons`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/coupons/validate` | Public / Auth | Server-side validation of promo code and discount calculation |
| `GET` | `/coupons` | Admin Only | List all promotional coupons |
| `POST` | `/coupons` | Admin Only | Create a new coupon code with usage limits |
| `DELETE` | `/coupons/:id` | Admin Only | Delete promo coupon |

---

## 6. Product Reviews (`/reviews`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/reviews/product/:productId`| Public | Fetch approved reviews for a product |
| `POST` | `/reviews` | Authenticated | Submit review (requires verified purchase of product) |
| `GET` | `/reviews/admin/all` | Admin Only | View all submitted reviews |
| `PATCH` | `/reviews/admin/:id/approval`| Admin Only | Toggle approval visibility |
| `DELETE` | `/reviews/admin/:id` | Admin Only | Delete inappropriate review |

---

## 7. Administrative Portal (`/admin`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/admin/dashboard-stats` | Admin Only | Aggregate KPIs: gross revenue, order count, low stock list, sales chart |
| `GET` | `/admin/customers` | Admin Only | Searchable list of registered users and order counts |
| `PATCH` | `/admin/customers/:id/toggle-status` | Admin Only | Activate or deactivate customer account |
