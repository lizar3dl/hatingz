import type { Request, Response, NextFunction } from 'express';
import { getPlayersForTeam } from '../repositories/teamRepository';

export async function listTeamPlayersController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const teamSlug = Array.isArray(req.params.teamSlug) ? req.params.teamSlug[0] : req.params.teamSlug;
    const players = await getPlayersForTeam(teamSlug);
    res.status(200).json(players.map((player) => ({
      id: player.id,
      name: player.name,
      team_id: player.teamId,
      shirt_number: player.shirtNumber,
      position: player.position,
    })));
  } catch (error) {
    next(error);
  }
}
