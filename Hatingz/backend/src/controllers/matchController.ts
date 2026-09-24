import type { Request, Response, NextFunction } from 'express';
import { listMatchesForUser } from '../services/matchService';

export async function listMatchesController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = req.user;
    const matches = await listMatchesForUser(user ?? {});
    res.status(200).json(matches);
  } catch (error) {
    next(error);
  }
}
