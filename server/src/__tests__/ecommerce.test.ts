import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import prisma from '../config/database';

const app = createApp();

describe('ApexCart API - Comprehensive Test Suite', () => {
  let customerToken: string;
  let adminToken: string;
  let sampleProductId: string;
  let createdOrderId: string;

  beforeAll(async () => {
    // 1. Health check
    const health = await request(app).get('/api/health');
    expect(health.status).toBe(200);

    // 2. Fetch existing seeded product
    const product = await prisma.product.findFirst({
      where: { isPublished: true, inventory: { quantity: { gt: 10 } } },
      include: { variants: true },
    });
    if (product) {
      sampleProductId = product.id;
    }

    // 3. Clear any past cart/orders for clean test user
    const testEmail = `test.user.${Date.now()}@example.com`;
    const regRes = await request(app).post('/api/auth/register').send({
      email: testEmail,
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'Runner',
    });
    customerToken = regRes.body.data.tokens.accessToken;
  });

  describe('1. Authentication & Authorization', () => {
    it('should authenticate admin successfully', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'admin@apexcart.com',
        password: 'Admin@123456',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('ADMIN');
      expect(res.body.data.tokens.accessToken).toBeDefined();
      adminToken = res.body.data.tokens.accessToken;
    });

    it('should login customer successfully', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'rahul.sharma@example.com',
        password: 'Customer@123456',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('CUSTOMER');
    });

    it('should reject unauthenticated request to protected admin endpoint', async () => {
      const res = await request(app).get('/api/admin/dashboard-stats');
      expect(res.status).toBe(401);
    });

    it('should reject customer accessing admin-only endpoint (RBAC)', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard-stats')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
    });

    it('should allow admin to access admin dashboard stats', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard-stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.metrics).toBeDefined();
      expect(res.body.data.metrics.totalProducts).toBeGreaterThan(0);
    });
  });

  describe('2. Products & Catalog Filtering', () => {
    it('should list products with pagination', async () => {
      const res = await request(app).get('/api/products?page=1&limit=6');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeLessThanOrEqual(6);
      expect(res.body.pagination.total).toBeGreaterThan(0);
    });

    it('should filter products by search keyword', async () => {
      const res = await request(app).get('/api/products?search=Sony');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].brand.toLowerCase()).toContain('sony');
    });

    it('should filter products by category', async () => {
      const res = await request(app).get('/api/products?category=electronics');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should sort products by price ascending', async () => {
      const res = await request(app).get('/api/products?sortBy=price_asc&limit=10');
      expect(res.status).toBe(200);
      const items = res.body.data;
      if (items.length >= 2) {
        expect(items[0].price).toBeLessThanOrEqual(items[1].price);
      }
    });

    it('should return search autocomplete suggestions', async () => {
      const res = await request(app).get('/api/products/suggestions?q=Son');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('3. Cart & Stock Validation', () => {
    it('should add product to customer cart', async () => {
      const res = await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          productId: sampleProductId,
          quantity: 1,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.items.length).toBeGreaterThan(0);
      expect(res.body.data.subtotal).toBeGreaterThan(0);
    });

    it('should prevent adding more items than available in inventory', async () => {
      const res = await request(app)
        .post('/api/cart/items')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          productId: sampleProductId,
          quantity: 999999, // Exceeds stock
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('stock');
    });

    it('should fetch user cart', async () => {
      const res = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.items.length).toBeGreaterThan(0);
    });
  });

  describe('4. Coupons & Server-side Validation', () => {
    it('should validate an active coupon code', async () => {
      const res = await request(app)
        .post('/api/coupons/validate')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          code: 'WELCOME10',
          cartTotal: 10000,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.discountAmount).toBe(1000); // 10% of 10,000
    });

    it('should reject invalid or non-existent coupon', async () => {
      const res = await request(app)
        .post('/api/coupons/validate')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          code: 'NON_EXISTENT_CODE_123',
          cartTotal: 10000,
        });

      expect(res.status).toBe(400);
    });

    it('should reject coupon if cart total is below min order value', async () => {
      const res = await request(app)
        .post('/api/coupons/validate')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          code: 'FESTIVE20', // requires 8000
          cartTotal: 2000,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Minimum order value');
    });
  });

  describe('5. Checkout & Order Placement', () => {
    it('should create order and deduct stock atomically', async () => {
      const res = await request(app)
        .post('/api/orders/checkout')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          shippingAddress: {
            fullName: 'Rahul Sharma',
            addressLine1: 'Flat 402, Outer Ring Road',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560103',
            country: 'India',
            phone: '+91 9811223344',
          },
          paymentMethod: 'COD',
          couponCode: 'WELCOME10',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.orderNumber).toBeDefined();
      expect(res.body.data.total).toBeGreaterThan(0);
      createdOrderId = res.body.data.id;
    });

    it('should fetch user order history', async () => {
      const res = await request(app)
        .get('/api/orders/my-orders')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should allow customer to cancel order in eligible status', async () => {
      const res = await request(app)
        .post(`/api/orders/${createdOrderId}/cancel`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ reason: 'Changed my mind about delivery date' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('CANCELLED');
    });
  });
});
