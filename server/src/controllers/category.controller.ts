import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { ApiResponse } from '../utils/apiResponse';

export class CategoryController {
  static async getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await ProductService.getCategories();
      return ApiResponse.success(res, 'Categories retrieved', categories);
    } catch (error) {
      next(error);
    }
  }

  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await ProductService.createCategory(req.body);
      return ApiResponse.created(res, 'Category created', category);
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await ProductService.updateCategory(req.params.id, req.body);
      return ApiResponse.success(res, 'Category updated', category);
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      await ProductService.deleteCategory(req.params.id);
      return ApiResponse.success(res, 'Category deleted');
    } catch (error) {
      next(error);
    }
  }
}
