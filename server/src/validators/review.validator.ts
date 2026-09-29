import { z } from 'zod';

export const createReviewSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  orderItemId: z.string().optional(),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  title: z.string().min(3, 'Review title is required'),
  content: z.string().min(10, 'Review comment must be at least 10 characters'),
});
