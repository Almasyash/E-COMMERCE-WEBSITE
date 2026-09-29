import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { ApiResponse } from '../utils/apiResponse';

export class ProductController {
  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.getProducts(req.query as any);
      return ApiResponse.paginated(
        res,
        'Products retrieved successfully',
        result.products,
        result.total,
        result.page,
        result.limit
      );
    } catch (error) {
      next(error);
    }
  }

  static async getProductBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getProductBySlugOrId(req.params.slug);
      return ApiResponse.success(res, 'Product details retrieved', product);
    } catch (error) {
      next(error);
    }
  }

  static async getSearchSuggestions(req: Request, res: Response, next: NextFunction) {
    try {
      const query = (req.query.q as string) || '';
      const suggestions = await ProductService.getSearchSuggestions(query);
      return ApiResponse.success(res, 'Suggestions retrieved', suggestions);
    } catch (error) {
      next(error);
    }
  }

  static async getRelated(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { categoryId } = req.query;
      const products = await ProductService.getRelatedProducts(id, categoryId as string);
      return ApiResponse.success(res, 'Related products retrieved', products);
    } catch (error) {
      next(error);
    }
  }

  // Admin endpoints
  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.createProduct(req.body);
      return ApiResponse.created(res, 'Product created successfully', product);
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.updateProduct(req.params.id, req.body);
      return ApiResponse.success(res, 'Product updated successfully', product);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.deleteProduct(req.params.id);
      return ApiResponse.success(res, 'Product deleted successfully', result);
    } catch (error) {
      next(error);
    }
  }
}
