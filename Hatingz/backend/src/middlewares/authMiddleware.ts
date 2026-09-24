// Responsável: João
import type { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../config/jwt';
import { ApiError } from './errorHandler';
import { getAuthenticatedUser } from '../services/authService';

export async function authMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new ApiError(401, 'UNAUTHORIZED', 'Missing or invalid bearer token'));
    return;
  }

  const token = authHeader.replace('Bearer ', '').trim();
  try {
    const payload = verifyJwt(token);
    const user = await getAuthenticatedUser(payload.userId);
    if (!user) {
      next(new ApiError(401, 'UNAUTHORIZED', 'User not found'));
      return;
    }
    req.user = { userId: user.id, email: user.email, favoriteTeam: user.favoriteTeam };
    next();
  } catch (_error) {
    next(new ApiError(401, 'UNAUTHORIZED', 'Missing or invalid bearer token'));
  }
}

