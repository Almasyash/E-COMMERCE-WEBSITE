import { z } from 'zod';

export const productQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  inStock: z.coerce.boolean().optional(),
  sortBy: z
    .enum(['relevance', 'newest', 'price_asc', 'price_desc', 'rating_desc', 'best_selling'])
    .default('newest'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12),
  featured: z.coerce.boolean().optional(),
});

export const createProductSchema = z.object({
  title: z.string().min(3, 'Product title is required'),
  description: z.string().min(10, 'Detailed description is required'),
  brand: z.string().min(2, 'Brand name is required'),
  sku: z.string().min(3, 'Unique SKU is required'),
  price: z.number().positive('Price must be greater than 0'),
  salePrice: z.number().positive().optional().nullable(),
  categoryId: z.string().uuid('Valid category ID required'),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  stock: z.number().int().min(0).default(10),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  specifications: z.record(z.string()).optional(),
  images: z
    .array(
      z.object({
        url: z.string().url('Image must be a valid URL'),
        altText: z.string().optional(),
        isPrimary: z.boolean().default(false),
        sortOrder: z.number().int().default(0),
      })
    )
    .optional(),
  variants: z
    .array(
      z.object({
        name: z.string().min(1),
        sku: z.string().min(1),
        price: z.number().positive(),
        salePrice: z.number().positive().optional().nullable(),
        stock: z.number().int().min(0).default(0),
        color: z.string().optional(),
        size: z.string().optional(),
      })
    )
    .optional(),
});

export const updateProductSchema = createProductSchema.partial();
