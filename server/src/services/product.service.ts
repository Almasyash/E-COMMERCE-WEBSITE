import prisma from '../config/database';
import { ApiError } from '../utils/apiError';

export interface ProductFilterQuery {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  sortBy?: 'relevance' | 'newest' | 'price_asc' | 'price_desc' | 'rating_desc' | 'best_selling';
  page?: number;
  limit?: number;
  featured?: boolean;
}

export class ProductService {
  static async getProducts(query: ProductFilterQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 12;
    const skip = (page - 1) * limit;

    const where: any = {
      isPublished: true,
    };

    if (query.featured !== undefined) {
      where.isFeatured = query.featured;
    }

    if (query.search) {
      const searchTerm = query.search.trim();
      where.OR = [
        { title: { contains: searchTerm } },
        { brand: { contains: searchTerm } },
        { description: { contains: searchTerm } },
        { sku: { contains: searchTerm } },
      ];
    }

    if (query.category) {
      where.category = {
        OR: [{ slug: query.category }, { id: query.category }],
      };
    }

    if (query.brand) {
      where.brand = query.brand;
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) where.price.gte = query.minPrice;
      if (query.maxPrice !== undefined) where.price.lte = query.maxPrice;
    }

    if (query.rating !== undefined) {
      where.rating = { gte: query.rating };
    }

    if (query.inStock) {
      where.inventory = {
        quantity: { gt: 0 },
      };
    }

    let orderBy: any = { createdAt: 'desc' };
    switch (query.sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'rating_desc':
        orderBy = { rating: 'desc' };
        break;
      case 'best_selling':
        orderBy = { reviewCount: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { sortOrder: 'asc' } },
          variants: true,
          inventory: { select: { quantity: true, minThreshold: true } },
        },
      }),
    ]);

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getProductBySlugOrId(identifier: string) {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ slug: identifier }, { id: identifier }],
      },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: {
          orderBy: { price: 'asc' },
        },
        inventory: true,
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
          },
        },
      },
    });

    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    return product;
  }

  static async getSearchSuggestions(query: string) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const term = query.trim();
    const products = await prisma.product.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: term } },
          { brand: { contains: term } },
          { category: { name: { contains: term } } },
        ],
      },
      take: 6,
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        salePrice: true,
        brand: true,
        images: {
          where: { isPrimary: true },
          take: 1,
          select: { url: true },
        },
      },
    });

    return products;
  }

  static async getRelatedProducts(productId: string, categoryId: string, limit = 4) {
    const products = await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: productId },
        isPublished: true,
      },
      take: limit,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
      },
    });

    return products;
  }

  // Admin Product Operations
  static async createProduct(data: any) {
    const slug =
      data.slug ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
        '-' +
        Math.floor(1000 + Math.random() * 9000);

    const { images, variants, stock, specifications, ...rest } = data;

    const product = await prisma.product.create({
      data: {
        ...rest,
        slug,
        specifications: specifications ? JSON.stringify(specifications) : null,
        images: images && images.length > 0 ? { create: images } : undefined,
        variants: variants && variants.length > 0 ? { create: variants } : undefined,
        inventory: {
          create: {
            quantity: stock !== undefined ? Number(stock) : 10,
            minThreshold: 5,
          },
        },
      },
      include: {
        category: true,
        images: true,
        variants: true,
        inventory: true,
      },
    });

    return product;
  }

  static async updateProduct(id: string, data: any) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw ApiError.notFound('Product not found');
    }

    const { images, variants, stock, specifications, ...rest } = data;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(specifications !== undefined
          ? { specifications: specifications ? JSON.stringify(specifications) : null }
          : {}),
      },
      include: {
        category: true,
        images: true,
        variants: true,
        inventory: true,
      },
    });

    if (stock !== undefined) {
      await prisma.inventory.upsert({
        where: { productId: id },
        update: { quantity: Number(stock) },
        create: { productId: id, quantity: Number(stock) },
      });
    }

    return updated;
  }

  static async deleteProduct(id: string) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw ApiError.notFound('Product not found');
    }

    await prisma.product.delete({ where: { id } });
    return { success: true };
  }

  // Categories
  static async getCategories() {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    });
    return categories;
  }

  static async createCategory(data: { name: string; slug?: string; description?: string; image?: string }) {
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    return await prisma.category.create({
      data: {
        ...data,
        slug,
      },
    });
  }

  static async updateCategory(id: string, data: any) {
    return await prisma.category.update({
      where: { id },
      data,
    });
  }

  static async deleteCategory(id: string) {
    return await prisma.category.delete({
      where: { id },
    });
  }
}
