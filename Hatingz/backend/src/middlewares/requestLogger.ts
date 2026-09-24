import type { NextFunction, Request, Response } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const method = req.method;
  const url = req.originalUrl;

  res.on("finish", () => {
    const elapsedMs = Date.now() - start;
    console.info(`[${new Date().toISOString()}] ${method} ${url} ${res.statusCode} ${elapsedMs}ms`);
  });

  next();
}
