import { z } from 'zod';

export const checkoutSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().min(2, 'Full name is required'),
    addressLine1: z.string().min(3, 'Address line 1 is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    postalCode: z.string().min(3, 'Postal code is required'),
    country: z.string().default('India'),
    phone: z.string().min(7, 'Phone number is required'),
  }),
  paymentMethod: z.enum(['COD', 'RAZORPAY', 'STRIPE', 'CARD', 'UPI']).default('COD'),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
    'RETURN_REQUESTED',
    'RETURNED',
  ]),
  trackingNumber: z.string().optional(),
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).optional(),
});

export const cancelOrderSchema = z.object({
  reason: z.string().min(3, 'Cancellation reason is required'),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().optional().nullable(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});
