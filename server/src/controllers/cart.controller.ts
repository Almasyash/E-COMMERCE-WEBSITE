import { Response, NextFunction } from 'express';
import { CartService } from '../services/cart.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

export class CartController {
  static async getCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const sessionId = (req.headers['x-session-id'] as string) || (req.query.sessionId as string);
      const cart = await CartService.getOrCreateCart(userId, sessionId);
      return ApiResponse.success(res, 'Cart retrieved', cart);
    } catch (error) {
      next(error);
    }
  }

  static async addToCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const sessionId = (req.headers['x-session-id'] as string) || (req.body.sessionId as string);
      const cart = await CartService.addToCart({ userId, sessionId }, req.body);
      return ApiResponse.success(res, 'Item added to cart', cart);
    } catch (error) {
      next(error);
    }
  }

  static async updateQuantity(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const sessionId = (req.headers['x-session-id'] as string) || (req.body.sessionId as string);
      const cart = await CartService.updateQuantity(
        { userId, sessionId },
        req.params.itemId,
        req.body.quantity
      );
      return ApiResponse.success(res, 'Cart updated', cart);
    } catch (error) {
      next(error);
    }
  }

  static async removeItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const sessionId = (req.headers['x-session-id'] as string) || (req.query.sessionId as string);
      const cart = await CartService.removeItem({ userId, sessionId }, req.params.itemId);
      return ApiResponse.success(res, 'Item removed from cart', cart);
    } catch (error) {
      next(error);
    }
  }

  static async clearCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const sessionId = (req.headers['x-session-id'] as string) || (req.query.sessionId as string);
      const cart = await CartService.clearCart({ userId, sessionId });
      return ApiResponse.success(res, 'Cart cleared', cart);
    } catch (error) {
      next(error);
    }
  }

  static async mergeCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { sessionId } = req.body;
      const cart = await CartService.mergeGuestCart(userId, sessionId);
      return ApiResponse.success(res, 'Cart merged successfully', cart);
    } catch (error) {
      next(error);
    }
  }
}
