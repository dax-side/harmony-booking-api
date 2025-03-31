import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

class ErrorResponse extends Error {
  statusCode: number;
  code?: number;
  errors?: any;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandler = (
  err: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log the error for server-side debugging
  logger.error(`${err.name || 'Error'}: ${err.message}`, err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'The requested resource could not be found';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    // Extract the duplicate field from the error message
    const field = err.message.match(/index: (?:.*\$)?([a-zA-Z0-9]*)_/)?.[1] || 'field';
    const message = `An account with this ${field} already exists`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors as any)
      .map((val: any) => val.message)
      .join(', ');
    error = new ErrorResponse(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid authentication token';
    error = new ErrorResponse(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Your session has expired. Please log in again';
    error = new ErrorResponse(message, 401);
  }

  // Generic error handling for common scenarios
  if (err.message.includes('ECONNREFUSED')) {
    const message = 'Unable to connect to the database';
    error = new ErrorResponse(message, 500);
  }

  // Send the response
  const isDebugMode = req.query.debug === 'true' && process.env.NODE_ENV !== 'production';
  
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Something went wrong on our end. Please try again later.',
    ...(isDebugMode && { stack: err.stack }),
  });
};

export { ErrorResponse, errorHandler }; 