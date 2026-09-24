import type { Request, Response, NextFunction } from 'express';
import { voteOnLineup } from '../services/lineupVoteService';

export async function voteLineupController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const lineupId = Array.isArray(req.params.lineupId) ? req.params.lineupId[0] : req.params.lineupId;
    const result = await voteOnLineup(req.user?.userId ?? '', lineupId);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
