export type LineupFormation = "4-3-3" | "4-4-2" | "3-5-2" | "4-2-3-1";

export type LineupPayload = {
  teamSlug: string;
  team_id?: string;
  matchId?: string | null;
  formation: LineupFormation;
  playerIds: string[];
  player_ids?: string[];
  isPublished: boolean;
};

export type Lineup = LineupPayload & {
  id?: string;
  authorName?: string;
  teamName?: string;
  voteCount?: number;
  playerNames?: string[];
};

export type VoteCount = {
  voteCount: number;
};
