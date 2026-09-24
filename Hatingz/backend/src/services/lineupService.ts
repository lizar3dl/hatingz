// Responsável: João
import { teams } from '../config/store';
import { ApiError } from '../middlewares/errorHandler';
import { getLineupById, getCommunityLineups, getVoteCount, saveLineup, getUserLineups, getLineupAuthorName } from '../repositories/lineupRepository';
import { getPlayersByTeam } from '../repositories/playerRepository';
import { validateLineupPayload } from '../models/validators';
import type { Lineup } from '../models';

export async function saveUserLineup(input: { userId: string; teamSlug: string; matchId?: string | null; formation: string; playerIds: string[]; isPublished: boolean }) {
  const validation = validateLineupPayload({
    teamSlug: input.teamSlug,
    formation: input.formation,
    playerIds: input.playerIds,
    isPublished: input.isPublished,
  });

  if (!validation.isValid) {
    throw new ApiError(400, 'VALIDATION_ERROR', validation.errors.join(', '));
  }

  const availablePlayers = await getPlayersByTeam(input.teamSlug);
  const playerIds = input.playerIds;
  const teamPlayerIds = new Set(availablePlayers.map((player) => player.id));
  if (playerIds.length !== 11 || new Set(playerIds).size !== 11) {
    throw new ApiError(400, 'INVALID_LINEUP', 'A lineup must contain exactly 11 unique players');
  }
  if (playerIds.some((playerId) => !teamPlayerIds.has(playerId))) {
    throw new ApiError(400, 'INVALID_PLAYER', 'A lineup player must belong to the selected team');
  }

  const teamId = teams.find((team) => team.slug === input.teamSlug)?.id ?? 'team-corinthians';
  const existingLineup = (await getUserLineups(input.userId)).find((lineup) => lineup.teamId === teamId && lineup.matchId === (input.matchId ?? null));
  const lineupId = existingLineup?.id ?? `lineup-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  if (existingLineup && existingLineup.isPublished && !input.isPublished) {
    throw new ApiError(400, 'LINEUP_IMMUTABLE', 'Published lineups cannot be edited');
  }

  const lineup = await saveLineup({
    id: lineupId,
    userId: input.userId,
    teamId,
    matchId: input.matchId ?? null,
    formation: input.formation as Lineup['formation'],
    playerIds,
    isPublished: input.isPublished,
  });

  return {
    ...lineup,
    authorName: await getLineupAuthorName(input.userId),
    voteCount: await getVoteCount(lineup.id),
  };
}

export async function listCommunityLineups(teamId?: string) {
  if (!teamId) {
    throw new ApiError(403, 'TEAM_NOT_FOUND', 'Authenticated user must have a favorite team');
  }

  const lineups = await getCommunityLineups(teamId);
  const items = await Promise.all(
    lineups.map(async (lineup) => {
      const teamPlayers = await getPlayersByTeam(teams.find((team) => team.id === lineup.teamId)?.slug ?? '');
      const playerNames = lineup.playerIds
        .map((playerId) => teamPlayers.find((player) => player.id === playerId)?.name)
        .filter((name): name is string => Boolean(name));
      return {
        ...lineup,
        authorName: await getLineupAuthorName(lineup.userId),
        teamName: teams.find((team) => team.id === lineup.teamId)?.name ?? 'Unknown',
        playerNames,
        voteCount: await getVoteCount(lineup.id),
      };
    }),
  );

  return items;
}

export async function readLineupById(lineupId: string) {
  const lineup = await getLineupById(lineupId);
  if (!lineup) {
    throw new ApiError(404, 'LINEUP_NOT_FOUND', 'Lineup not found');
  }
  return {
    ...lineup,
    authorName: await getLineupAuthorName(lineup.userId),
    voteCount: await getVoteCount(lineup.id),
  };
}
