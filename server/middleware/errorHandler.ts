import { NextFunction, Request, Response } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  status?: number;
  isOperational?: boolean;
}

export function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log the error for debugging
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Determine status code
  const status = err.statusCode || err.status || 500;
  
  // Determine error message
  const message = err.message || 'Internal Server Error';

  // Don't leak error details in production
  const errorResponse = {
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err
    })
  };

  res.status(status).json(errorResponse);
}

// Custom error class for operational errors
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Async error wrapper to catch async errors
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 