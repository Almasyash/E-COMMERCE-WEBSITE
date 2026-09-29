import { z } from 'zod';

export const validateCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required').trim().toUpperCase(),
  cartTotal: z.number().positive('Cart total must be greater than 0'),
});

export const createCouponSchema = z.object({
  code: z.string().min(3).max(20).trim().toUpperCase(),
  description: z.string().optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']).default('PERCENTAGE'),
  discountValue: z.number().positive(),
  minOrderValue: z.number().min(0).default(0),
  maxDiscount: z.number().positive().optional().nullable(),
  startDate: z.coerce.date().default(() => new Date()),
  expiryDate: z.coerce.date(),
  usageLimit: z.number().int().positive().optional().nullable(),
  perUserLimit: z.number().int().min(1).default(1),
  isActive: z.boolean().default(true),
});

export const updateCouponSchema = createCouponSchema.partial();
