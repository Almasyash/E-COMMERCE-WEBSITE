import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { ApiResponse } from '../utils/apiResponse';

export class AdminController {
  static async getDashboardStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getDashboardStats();
      return ApiResponse.success(res, 'Dashboard statistics retrieved', stats);
    } catch (error) {
      next(error);
    }
  }

  static async getCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const search = req.query.search as string;
      const result = await AdminService.getCustomers(page, limit, search);
      return ApiResponse.paginated(
        res,
        'Customers list retrieved',
        result.customers,
        result.total,
        result.page,
        result.limit
      );
    } catch (error) {
      next(error);
    }
  }

  static async toggleCustomerStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.toggleCustomerStatus(req.params.id);
      return ApiResponse.success(res, 'Customer account status updated', result);
    } catch (error) {
      next(error);
    }
  }
}
