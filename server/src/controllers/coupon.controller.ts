import { Request, Response, NextFunction } from 'express';
import { CouponService } from '../services/coupon.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

export class CouponController {
  static async validateCoupon(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { code, cartTotal } = req.body;
      const result = await CouponService.validateCoupon(code, cartTotal, req.user?.userId);
      return ApiResponse.success(res, 'Coupon is valid', result);
    } catch (error) {
      next(error);
    }
  }

  // Admin endpoints
  static async getAllCoupons(_req: Request, res: Response, next: NextFunction) {
    try {
      const coupons = await CouponService.getAllCoupons();
      return ApiResponse.success(res, 'Coupons retrieved', coupons);
    } catch (error) {
      next(error);
    }
  }

  static async createCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const coupon = await CouponService.createCoupon(req.body);
      return ApiResponse.created(res, 'Coupon created', coupon);
    } catch (error) {
      next(error);
    }
  }

  static async updateCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const coupon = await CouponService.updateCoupon(req.params.id, req.body);
      return ApiResponse.success(res, 'Coupon updated', coupon);
    } catch (error) {
      next(error);
    }
  }

  static async deleteCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      await CouponService.deleteCoupon(req.params.id);
      return ApiResponse.success(res, 'Coupon deleted');
    } catch (error) {
      next(error);
    }
  }
}
