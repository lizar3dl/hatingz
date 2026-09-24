import type { Request, Response, NextFunction } from 'express';
import { teams } from '../config/store';
import { listCommunityLineups, saveUserLineup } from '../services/lineupService';

export async function saveLineupController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const requestedTeam = String(req.body.team_id ?? req.body.teamId ?? req.body.teamSlug ?? '');
    const team = teams.find((item) => item.id === requestedTeam || item.slug === requestedTeam);
    const playerIds = req.body.player_ids ?? req.body.playerIds;

    const result = await saveUserLineup({
      userId: req.user?.userId ?? '',
      teamSlug: team?.slug ?? requestedTeam,
      matchId: req.body.matchId ?? null,
      formation: req.body.formation,
      playerIds: Array.isArray(playerIds) ? playerIds.map((playerId: unknown) => String(playerId)) : playerIds,
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
