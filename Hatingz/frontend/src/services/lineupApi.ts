import api from "./api";
import type { Lineup, LineupPayload, VoteCount } from "../types/lineup";

export async function saveLineup(payload: LineupPayload): Promise<Lineup> {
  const response = await api.post<Lineup>("/lineups", payload);
  return response.data;
}

export async function listCommunityLineups(): Promise<Lineup[]> {
  const response = await api.get<Lineup[]>("/lineups/community");
  return response.data;
}

export async function voteForLineup(lineupId: string): Promise<VoteCount> {
  const response = await api.post<VoteCount>(`/lineups/${lineupId}/votes`);
  return response.data;
}
