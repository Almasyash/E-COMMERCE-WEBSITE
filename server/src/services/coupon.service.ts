import prisma from '../config/database';
import { ApiError } from '../utils/apiError';

export class CouponService {
  static async validateCoupon(code: string, cartTotal: number, userId?: string) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      throw ApiError.badRequest('Invalid or inactive coupon code');
    }

    const now = new Date();
    if (now < new Date(coupon.startDate)) {
      throw ApiError.badRequest('This coupon promotion has not started yet');
    }

    if (now > new Date(coupon.expiryDate)) {
      throw ApiError.badRequest('This coupon has expired');
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw ApiError.badRequest('This coupon has reached its maximum global usage limit');
    }

    const minOrderVal = Number(coupon.minOrderValue);
    if (cartTotal < minOrderVal) {
      throw ApiError.badRequest(
        `Minimum order value of ₹${minOrderVal.toLocaleString()} required to use this coupon`
      );
    }

    if (userId) {
      const userUsageCount = await prisma.couponUsage.count({
        where: {
          couponId: coupon.id,
          userId,
        },
      });

      if (userUsageCount >= coupon.perUserLimit) {
        throw ApiError.badRequest(
          `You have reached the maximum allowed usage limit (${coupon.perUserLimit}) for this coupon`
        );
      }
    }

    // Calculate discount amount server-side
    let discountAmount = 0;
    const discountVal = Number(coupon.discountValue);
    const maxDiscount = coupon.maxDiscount ? Number(coupon.maxDiscount) : null;

    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (cartTotal * discountVal) / 100;
      if (maxDiscount && discountAmount > maxDiscount) {
        discountAmount = maxDiscount;
      }
    } else {
      // FIXED
      discountAmount = Math.min(discountVal, cartTotal);
    }

    discountAmount = Math.round(discountAmount * 100) / 100;

    return {
      couponId: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: discountVal,
      discountAmount,
      description: coupon.description,
      finalTotal: Math.max(0, cartTotal - discountAmount),
    };
  }

  // Admin coupon management
  static async getAllCoupons() {
    return await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { usages: true } },
      },
    });
  }

  static async createCoupon(data: any) {
    const existing = await prisma.coupon.findUnique({
      where: { code: data.code.trim().toUpperCase() },
    });

    if (existing) {
      throw ApiError.conflict('A coupon with this code already exists');
    }

    return await prisma.coupon.create({
      data: {
        ...data,
        code: data.code.trim().toUpperCase(),
      },
    });
  }

  static async updateCoupon(id: string, data: any) {
    return await prisma.coupon.update({
      where: { id },
      data: {
        ...data,
        code: data.code ? data.code.trim().toUpperCase() : undefined,
      },
    });
  }

  static async deleteCoupon(id: string) {
    return await prisma.coupon.delete({ where: { id } });
  }
}
