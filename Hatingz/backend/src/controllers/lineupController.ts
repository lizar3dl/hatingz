import type { Request, Response, NextFunction } from 'express';
import { listCommunityLineups, saveUserLineup } from '../services/lineupService';

export async function saveLineupController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await saveUserLineup({
      userId: req.user?.userId ?? '',
      teamSlug: req.body.teamSlug,
      matchId: req.body.matchId ?? null,
      formation: req.body.formation,
      playerIds: req.body.playerIds,
      isPublished: Boolean(req.body.isPublished),
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function communityLineupsController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await listCommunityLineups(req.user?.favoriteTeam?.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
