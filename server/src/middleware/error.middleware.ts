import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors;

  // Handle Prisma unique constraint violations (e.g. duplicate email, sku, slug)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[]) || ['resource'];
      statusCode = 409;
      message = `A record with this ${target.join(', ')} already exists.`;
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Requested record was not found.';
    } else {
      statusCode = 400;
      message = `Database query error [${err.code}].`;
    }
  }

  // Handle bad JSON body
  if (err instanceof SyntaxError && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON syntax in request body.';
  }

  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
    ...(!isProduction && err.stack ? { stack: err.stack } : {}),
  });
};

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, `Route ${req.method} ${req.originalUrl} not found`));
};
