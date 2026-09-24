export type Team = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
};

export type Player = {
  id: string;
  teamId: string;
  name: string;
  shirtNumber: number;
  position: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  favoriteTeamId: string;
  createdAt: string;
};

export type Match = {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  status: string;
  startsAt: string;
};

export type LineupFormation = '4-3-3' | '4-4-2' | '3-5-2' | '4-2-3-1';

export type Lineup = {
  id: string;
  userId: string;
  teamId: string;
  matchId?: string | null;
  formation: LineupFormation;
  playerIds: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LineupVote = {
  id: string;
  userId: string;
  lineupId: string;
  createdAt: string;
};

export type ExpulsionVote = {
  id: string;
  userId: string;
  matchId: string;
  playerId: string;
  createdAt: string;
};
