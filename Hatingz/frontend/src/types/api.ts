export type Team = {
  name: string;
  slug: string;
  logoUrl: string;
};

export type User = {
  name: string;
  email: string;
  favoriteTeam: Team;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type MatchCard = {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: string;
  startsAt: string;
};

export type Lineup = {
  id?: string;
  teamSlug: string;
  formation: '4-3-3' | '4-4-2' | '3-5-2' | '4-2-3-1';
  playerIds: string[];
  isPublished: boolean;
  authorName?: string;
  voteCount?: number;
  playerNames?: string[];
};

export type VoteCount = {
  voteCount: number;
};
