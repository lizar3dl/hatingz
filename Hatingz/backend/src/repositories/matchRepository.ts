import { matches, teams } from '../config/store';
import type { Match, Team } from '../models';

export async function findMatchesByFavoriteTeam(teamId: string): Promise<(Match & { homeTeam?: Team; awayTeam?: Team })[]> {
  return matches
    .filter((match) => match.homeTeamId === teamId || match.awayTeamId === teamId)
    .map((match) => ({
      ...match,
      homeTeam: teams.find((team) => team.id === match.homeTeamId),
      awayTeam: teams.find((team) => team.id === match.awayTeamId),
    }));
}
