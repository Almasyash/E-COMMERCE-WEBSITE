import { Response } from 'express';

export class ApiResponse {
  static success<T>(res: Response, message: string, data?: T, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created<T>(res: Response, message: string, data?: T) {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static paginated<T>(
    res: Response,
    message: string,
    items: T[],
    total: number,
    page: number,
    limit: number,
    statusCode = 200
  ) {
    const totalPages = Math.ceil(total / limit);
    return res.status(statusCode).json({
      success: true,
      message,
      data: items,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  }
}
