import { lineups, lineupVotes, teams } from '../config/store';
import { getUserById } from './userRepository';
import type { Lineup } from '../models';

export async function saveLineup(input: Omit<Lineup, 'createdAt' | 'updatedAt'> & { id?: string }): Promise<Lineup> {
  const existingIndex = lineups.findIndex((item) => item.id === input.id);
  if (existingIndex >= 0) {
    const updated = { ...lineups[existingIndex], ...input, updatedAt: new Date().toISOString() } as Lineup;
    lineups[existingIndex] = updated;
    return updated;
  }

  const created: Lineup = {
    id: input.id ?? `lineup-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    userId: input.userId,
    teamId: input.teamId,
    matchId: input.matchId ?? null,
    formation: input.formation,
    playerIds: input.playerIds,
    isPublished: input.isPublished,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  lineups.push(created);
  return created;
}

export async function getCommunityLineups(teamId: string): Promise<Lineup[]> {
  return [...lineups.filter((lineup) => lineup.isPublished && lineup.teamId === teamId)]
    .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
}

export async function getLineupById(lineupId: string): Promise<Lineup | undefined> {
  return lineups.find((lineup) => lineup.id === lineupId);
}

export async function getVoteCount(lineupId: string): Promise<number> {
  return lineupVotes.filter((vote) => vote.lineupId === lineupId).length;
}

export async function voteForLineup(userId: string, lineupId: string): Promise<boolean> {
  if (lineupVotes.some((vote) => vote.userId === userId && vote.lineupId === lineupId)) {
    return false;
  }

  lineupVotes.push({ id: `vote-${Date.now()}-${Math.random().toString(16).slice(2)}`, userId, lineupId, createdAt: new Date().toISOString() });
  return true;
}

export async function getUserLineups(userId: string): Promise<Lineup[]> {
  return lineups.filter((lineup) => lineup.userId === userId);
}

export async function getLineupAuthorName(userId: string): Promise<string> {
  const user = await getUserById(userId);
  return user?.name ?? 'Community Fan';
}

export async function getLineupTeamName(teamId: string): Promise<string> {
  return teams.find((team) => team.id === teamId)?.name ?? 'Unknown';
}
