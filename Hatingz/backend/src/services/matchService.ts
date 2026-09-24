import { ApiError } from '../middlewares/errorHandler';
import { getMatchesForTeam } from '../repositories/teamRepository';
import type { Team } from '../models';

export async function listMatchesForUser(user: { favoriteTeam?: Team }) {
  if (!user.favoriteTeam) {
    throw new ApiError(403, 'TEAM_NOT_FOUND', 'Authenticated user must have a favorite team');
  }

  const matches = await getMatchesForTeam(user.favoriteTeam.slug);
  return matches.map((match) => ({
    id: match.id,
    homeTeam: { name: match.homeTeam?.name ?? '', slug: match.homeTeam?.slug ?? '', logoUrl: match.homeTeam?.logoUrl ?? '' },
    awayTeam: { name: match.awayTeam?.name ?? '', slug: match.awayTeam?.slug ?? '', logoUrl: match.awayTeam?.logoUrl ?? '' },
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    status: match.status,
    startsAt: match.startsAt,
  }));
}
