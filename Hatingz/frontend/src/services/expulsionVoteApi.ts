import api from "./api";
import type { ExpulsionVoteCandidate, ExpulsionVoteCount } from "../types/expulsionVote";

export async function listEligiblePlayers(matchId: string): Promise<ExpulsionVoteCandidate[]> {
  const response = await api.get<ExpulsionVoteCandidate[]>(`/matches/${matchId}/expulsion-votes`);
  return response.data;
}

export async function voteToExpel(matchId: string, playerId: string): Promise<ExpulsionVoteCount> {
  const response = await api.post<ExpulsionVoteCount>(`/matches/${matchId}/expulsion-votes`, { playerId });
  return response.data;
}
