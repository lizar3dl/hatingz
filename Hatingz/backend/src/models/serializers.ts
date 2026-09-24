import type { Match, Team, User } from './index';

export function serializeUser(user: User & { favoriteTeam?: Team }) {
  return {
    name: user.name,
    email: user.email,
    favoriteTeam: user.favoriteTeam
      ? { name: user.favoriteTeam.name, slug: user.favoriteTeam.slug, logoUrl: user.favoriteTeam.logoUrl }
      : undefined,
  };
}

export function serializeMatch(match: Match & { homeTeam?: Team; awayTeam?: Team }) {
  return {
    id: match.id,
    homeTeam: match.homeTeam ? { name: match.homeTeam.name, slug: match.homeTeam.slug, logoUrl: match.homeTeam.logoUrl } : null,
    awayTeam: match.awayTeam ? { name: match.awayTeam.name, slug: match.awayTeam.slug, logoUrl: match.awayTeam.logoUrl } : null,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    status: match.status,
    startsAt: match.startsAt,
  };
}
