import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation error',
      details: err.issues.map(i => ({
        path: i.path.join('.'),
        message: i.message,
      })),
    });
    return;
  }

  // Known application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  // Multer file size errors
  if (err.message?.includes('File too large') || err.message?.includes('Only PDF')) {
    res.status(400).json({ error: err.message });
    return;
  }

  // Unexpected errors
  console.error('[Unhandled Error]', err);
  res.status(500).json({ error: 'Internal server error' });
}
