export type ExpulsionVoteCandidate = {
  id: string;
  name: string;
  position: string;
  teamId: string;
  teamName: string;
  voteCount?: number;
  hasVoted?: boolean;
  state?: "open" | "voted";
};

export type ExpulsionVoteCount = {
  voteCount: number;
};
