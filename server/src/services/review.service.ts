import prisma from '../config/database';
import { ApiError } from '../utils/apiError';

export class ReviewService {
  static async createReview(
    userId: string,
    data: {
      productId: string;
      orderItemId?: string;
      rating: number;
      title: string;
      content: string;
    }
  ) {
    const { productId, rating, title, content } = data;

    // Verify product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw ApiError.notFound('Product not found');
    }

    // Verify verified purchase requirement
    const verifiedOrder = await prisma.order.findFirst({
      where: {
        userId,
        status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'] },
        items: {
          some: { productId },
        },
      },
      include: {
        items: {
          where: { productId },
        },
      },
    });

    if (!verifiedOrder) {
      throw ApiError.badRequest(
        'Verified Purchase Required: You can only review products that you have ordered.'
      );
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingReview) {
      throw ApiError.badRequest('You have already submitted a review for this product');
    }

    const orderItemId = data.orderItemId || verifiedOrder.items[0]?.id || null;

    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        orderItemId,
        rating,
        title,
        content,
        isApproved: true,
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
      },
    });

    // Recalculate average rating & review count for the product
    await this.updateProductRatingStats(productId);

    return review;
  }

  static async getProductReviews(productId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [total, reviews] = await Promise.all([
      prisma.review.count({ where: { productId, isApproved: true } }),
      prisma.review.findMany({
        where: { productId, isApproved: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        },
      }),
    ]);

    return {
      reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Admin Review Moderation
  static async getAllReviews(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [total, reviews] = await Promise.all([
      prisma.review.count(),
      prisma.review.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          product: { select: { id: true, title: true, slug: true } },
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
      }),
    ]);

    return { reviews, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static async toggleApproval(reviewId: string) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw ApiError.notFound('Review not found');
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { isApproved: !review.isApproved },
    });

    await this.updateProductRatingStats(review.productId);
    return updated;
  }

  static async deleteReview(reviewId: string) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw ApiError.notFound('Review not found');
    }

    await prisma.review.delete({ where: { id: reviewId } });
    await this.updateProductRatingStats(review.productId);
    return { success: true };
  }

  private static async updateProductRatingStats(productId: string) {
    const aggregations = await prisma.review.aggregate({
      where: { productId, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const averageRating = aggregations._avg.rating
      ? Math.round(aggregations._avg.rating * 10) / 10
      : 0.0;
    const reviewCount = aggregations._count.rating || 0;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: averageRating,
        reviewCount,
      },
    });
  }
}
