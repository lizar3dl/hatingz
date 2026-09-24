import { expulsionVotes, matches, players, teams } from '../config/store';

export async function getEligiblePlayers(matchId: string, teamId?: string): Promise<Array<{ id: string; name: string; position: string; teamId: string; teamName: string }>> {
  const match = matches.find((item) => item.id === matchId);
  if (!match) return [];

  if (teamId && teamId !== match.homeTeamId && teamId !== match.awayTeamId) {
    return [];
  }
  const teamIds = teamId ? new Set([teamId]) : new Set([match.homeTeamId, match.awayTeamId]);
  return players
    .filter((player) => teamIds.has(player.teamId))
    .map((player) => ({
      id: player.id,
      name: player.name,
      position: player.position,
      teamId: player.teamId,
      teamName: teams.find((team) => team.id === player.teamId)?.name ?? 'Unknown',
    }));
}

export async function registerExpulsionVote(userId: string, matchId: string, playerId: string): Promise<boolean> {
  if (expulsionVotes.some((vote) => vote.userId === userId && vote.matchId === matchId && vote.playerId === playerId)) {
    return false;
  }

  expulsionVotes.push({
    id: `exp-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    userId,
    matchId,
    playerId,
    createdAt: new Date().toISOString(),
  });

  return true;
}

export async function getExpulsionVoteCount(matchId: string, playerId: string): Promise<number> {
  return expulsionVotes.filter((vote) => vote.matchId === matchId && vote.playerId === playerId).length;
}
