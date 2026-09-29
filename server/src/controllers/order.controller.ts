import { Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

export class OrderController {
  static async checkout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.checkout(req.user!.userId, req.body);
      return ApiResponse.created(res, 'Order placed successfully', order);
    } catch (error) {
      next(error);
    }
  }

  static async getMyOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const result = await OrderService.getCustomerOrders(req.user!.userId, page, limit);
      return ApiResponse.paginated(
        res,
        'Orders retrieved',
        result.orders,
        result.total,
        result.page,
        result.limit
      );
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.getOrderById(
        req.params.id,
        req.user!.role === 'ADMIN' ? undefined : req.user!.userId
      );
      return ApiResponse.success(res, 'Order details retrieved', order);
    } catch (error) {
      next(error);
    }
  }

  static async cancelOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.cancelOrder(
        req.params.id,
        req.user!.userId,
        req.body.reason
      );
      return ApiResponse.success(res, 'Order cancelled successfully', order);
    } catch (error) {
      next(error);
    }
  }

  // Admin order endpoints
  static async getAllOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await OrderService.getAllOrders(req.query as any);
      return ApiResponse.paginated(
        res,
        'Admin orders list',
        result.orders,
        result.total,
        result.page,
        result.limit
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const updated = await OrderService.updateOrderStatus(req.params.id, req.body);
      return ApiResponse.success(res, 'Order status updated', updated);
    } catch (error) {
      next(error);
    }
  }
}
