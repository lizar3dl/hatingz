// Responsável: João
import { ApiError } from '../middlewares/errorHandler';
import { expulsionVotes } from '../config/store';
import { getEligiblePlayers, getExpulsionVoteCount, registerExpulsionVote } from '../repositories/expulsionVoteRepository';

export async function getEligiblePlayersForMatch(matchId: string, teamId?: string, userId?: string) {
  const players = await getEligiblePlayers(matchId, teamId);
  return Promise.all(players.map(async (player) => ({
    ...player,
    voteCount: await getExpulsionVoteCount(matchId, player.id),
    hasVoted: Boolean(userId && expulsionVotes.some((vote) => vote.userId === userId && vote.matchId === matchId && vote.playerId === player.id)),
    state: userId && expulsionVotes.some((vote) => vote.userId === userId && vote.matchId === matchId && vote.playerId === player.id) ? 'voted' as const : 'open' as const,
  })));
}

export async function voteToExpel(userId: string, matchId: string, playerId: string, teamId?: string) {
  const eligiblePlayers = await getEligiblePlayers(matchId, teamId);
  const isEligible = eligiblePlayers.some((player) => player.id === playerId);

  if (!isEligible) {
    throw new ApiError(400, 'INVALID_PLAYER', 'Player is not eligible for this match');
  }

  const success = await registerExpulsionVote(userId, matchId, playerId);
  if (!success) {
    throw new ApiError(409, 'DUPLICATE_VOTE', 'Vote already submitted for this player and match');
  }

  return { voteCount: await getExpulsionVoteCount(matchId, playerId) };
}
