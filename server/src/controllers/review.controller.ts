import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/review.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

export class ReviewController {
  static async createReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const review = await ReviewService.createReview(req.user!.userId, req.body);
      return ApiResponse.created(res, 'Review submitted successfully', review);
    } catch (error) {
      next(error);
    }
  }

  static async getProductReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const result = await ReviewService.getProductReviews(req.params.productId, page, limit);
      return ApiResponse.paginated(
        res,
        'Reviews retrieved',
        result.reviews,
        result.total,
        result.page,
        result.limit
      );
    } catch (error) {
      next(error);
    }
  }

  // Admin endpoints
  static async getAllReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await ReviewService.getAllReviews(page, limit);
      return ApiResponse.paginated(
        res,
        'All reviews',
        result.reviews,
        result.total,
        result.page,
        result.limit
      );
    } catch (error) {
      next(error);
    }
  }

  static async toggleApproval(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await ReviewService.toggleApproval(req.params.id);
      return ApiResponse.success(res, 'Review approval updated', updated);
    } catch (error) {
      next(error);
    }
  }

  static async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      await ReviewService.deleteReview(req.params.id);
      return ApiResponse.success(res, 'Review deleted');
    } catch (error) {
      next(error);
    }
  }
}
