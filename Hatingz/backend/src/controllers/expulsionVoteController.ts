import type { Request, Response, NextFunction } from 'express';
import { getEligiblePlayersForMatch, voteToExpel } from '../services/expulsionVoteService';

export async function listExpulsionVoteCandidatesController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const matchId = Array.isArray(req.params.matchId) ? req.params.matchId[0] : req.params.matchId;
    const players = await getEligiblePlayersForMatch(matchId, req.user?.favoriteTeam?.id, req.user?.userId);
    res.status(200).json(players);
  } catch (error) {
    next(error);
  }
}

export async function castExpulsionVoteController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const matchId = Array.isArray(req.params.matchId) ? req.params.matchId[0] : req.params.matchId;
    const result = await voteToExpel(req.user?.userId ?? '', matchId, req.body.playerId, req.user?.favoriteTeam?.id);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
