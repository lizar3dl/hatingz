import { NextFunction, Request, Response } from 'express';

export class ApiError extends Error {
  statusCode: number;
  code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ code: err.code, message: err.message });
    return;
  }

  if (err instanceof Error) {
    console.error('[ratingz] Unexpected error:', err.message);
    res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Unexpected server error' });
    return;
  }

  res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Unexpected server error' });
}
