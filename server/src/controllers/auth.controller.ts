import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      return ApiResponse.created(res, 'User registered successfully', result);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return ApiResponse.success(res, 'Logged in successfully', result);
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const tokens = await AuthService.refreshToken(refreshToken);
      return ApiResponse.success(res, 'Token refreshed successfully', tokens);
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getProfile(req.user!.userId);
      return ApiResponse.success(res, 'Profile retrieved', user);
    } catch (error) {
      next(error);
    }
  }

  static async updateMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const updated = await AuthService.updateProfile(req.user!.userId, req.body);
      return ApiResponse.success(res, 'Profile updated successfully', updated);
    } catch (error) {
      next(error);
    }
  }

  static async addAddress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const address = await AuthService.addAddress(req.user!.userId, req.body);
      return ApiResponse.created(res, 'Address added successfully', address);
    } catch (error) {
      next(error);
    }
  }

  static async updateAddress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const address = await AuthService.updateAddress(req.user!.userId, req.params.id, req.body);
      return ApiResponse.success(res, 'Address updated successfully', address);
    } catch (error) {
      next(error);
    }
  }

  static async deleteAddress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.deleteAddress(req.user!.userId, req.params.id);
      return ApiResponse.success(res, 'Address deleted successfully', result);
    } catch (error) {
      next(error);
    }
  }
}
