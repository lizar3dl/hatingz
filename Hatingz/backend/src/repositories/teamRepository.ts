// Responsável: João
import { matches, players, teams } from '../config/store';
import type { Match, Team } from '../models';

export async function getAllTeams(): Promise<Team[]> {
  return teams;
}

export async function getTeamBySlug(slug: string): Promise<Team | undefined> {
  return teams.find((team) => team.slug === slug);
}

export async function getMatchesForTeam(teamSlug: string): Promise<(Match & { homeTeam?: Team; awayTeam?: Team })[]> {
  const team = await getTeamBySlug(teamSlug);
  if (!team) return [];

  return matches
    .filter((match) => match.homeTeamId === team.id || match.awayTeamId === team.id)
    .map((match) => ({
      ...match,
      homeTeam: teams.find((item) => item.id === match.homeTeamId),
      awayTeam: teams.find((item) => item.id === match.awayTeamId),
    }));
}

export async function getPlayersForTeam(teamSlug: string) {
  const team = await getTeamBySlug(teamSlug);
  return team ? players.filter((player) => player.teamId === team.id) : [];
}

