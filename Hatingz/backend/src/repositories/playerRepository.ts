import { matches, players, teams } from '../config/store';
import type { Player } from '../models';

export async function getPlayersByTeam(teamSlug: string): Promise<Player[]> {
  const team = teams.find((item) => item.slug === teamSlug);
  if (!team) return [];
  return players.filter((player) => player.teamId === team.id);
}

export async function getPlayerById(playerId: string): Promise<Player | undefined> {
  return players.find((player) => player.id === playerId);
}

export async function listPlayersForMatch(matchId: string): Promise<Player[]> {
  const match = matches.find((item) => item.id === matchId);
  if (!match) return [];
  const teamIds = new Set([match.homeTeamId, match.awayTeamId]);
  return players.filter((player) => teamIds.has(player.teamId));
}
