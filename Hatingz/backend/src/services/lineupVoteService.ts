// Respons?vel: Jo?o
import { ApiError } from '../middlewares/errorHandler';
import { getLineupById, getVoteCount, voteForLineup } from '../repositories/lineupRepository';

export async function voteOnLineup(userId: string, lineupId: string) {
  const lineup = await getLineupById(lineupId);
  if (!lineup) {
    throw new ApiError(404, 'LINEUP_NOT_FOUND', 'Lineup not found');
  }
  if (!lineup.isPublished) {
    throw new ApiError(400, 'LINEUP_NOT_PUBLISHED', 'Lineup is not published yet');
  }

  const success = await voteForLineup(userId, lineupId);
  if (!success) {
    throw new ApiError(409, 'DUPLICATE_LINEUP_VOTE', 'Vote already recorded for this lineup');
  }

  return { voteCount: await getVoteCount(lineupId) };
}
