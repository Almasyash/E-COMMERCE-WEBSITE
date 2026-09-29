import { Response, NextFunction } from 'express';
import { WishlistService } from '../services/wishlist.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

export class WishlistController {
  static async getWishlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const wishlist = await WishlistService.getWishlist(req.user!.userId);
      return ApiResponse.success(res, 'Wishlist retrieved', wishlist);
    } catch (error) {
      next(error);
    }
  }

  static async toggle(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { productId } = req.body;
      const result = await WishlistService.toggleWishlist(req.user!.userId, productId);
      return ApiResponse.success(res, result.message, result);
    } catch (error) {
      next(error);
    }
  }
}
