declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        favoriteTeam?: {
          id: string;
          name: string;
          slug: string;
          logoUrl: string;
        };
      };
    }
  }
}

export {};
