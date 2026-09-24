import type { Team, LineupFormation } from './index';

export const LINEUP_FORMATIONS: LineupFormation[] = ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1'];

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidTeamSlug(value: string): boolean {
  return ['palmeiras', 'bahia', 'corinthians', 'sao-paulo', 'vasco'].includes(value.toLowerCase());
}

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  favoriteTeamSlug: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export function validateRegisterInput(input: RegisterInput): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!input.name || input.name.trim().length < 2) errors.push('name is required');
  if (!isValidEmail(input.email)) errors.push('email is invalid');
  if (!input.password || input.password.length < 8) errors.push('password must be at least 8 characters');
  if (!isValidTeamSlug(input.favoriteTeamSlug)) errors.push('favoriteTeamSlug is invalid');
  return { isValid: errors.length === 0, errors };
}

export function validateLoginInput(input: LoginInput): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!isValidEmail(input.email)) errors.push('email is invalid');
  if (!input.password || input.password.length < 8) errors.push('password must be at least 8 characters');
  return { isValid: errors.length === 0, errors };
}

export function validateLineupPayload(payload: {
  teamSlug: string;
  formation: string;
  playerIds: string[];
  isPublished: boolean;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!isValidTeamSlug(payload.teamSlug)) errors.push('teamSlug is invalid');
  if (!LINEUP_FORMATIONS.includes(payload.formation as LineupFormation)) {
    errors.push(`formation must be one of ${LINEUP_FORMATIONS.join(', ')}`);
  }
  if (!Array.isArray(payload.playerIds) || payload.playerIds.length === 0 || payload.playerIds.length > 11) {
    errors.push('playerIds must contain between 1 and 11 players');
  }
  if (new Set(payload.playerIds).size !== payload.playerIds.length) {
    errors.push('playerIds must be unique');
  }
  return { isValid: errors.length === 0, errors };
}

export function serializeTeam(team: Team): { name: string; slug: string; logoUrl: string } {
  return { name: team.name, slug: team.slug, logoUrl: team.logoUrl };
}
