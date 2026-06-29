import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export interface AppError extends Error {
  status?: number;
  isOperational?: boolean;
}

export const createError = (message: string, status = 400): AppError => {
  const err: AppError = new Error(message);
  err.status = status;
  err.isOperational = true;
  return err;
};

export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  const status = err.status ?? 500;
  const isDev = env.NODE_ENV === 'development';

  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} — ${err.message}`);

  res.status(status).json({
    success: false,
    error: status === 500 && !isDev ? 'Internal server error' : err.message,
    ...(isDev && { stack: err.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
};
