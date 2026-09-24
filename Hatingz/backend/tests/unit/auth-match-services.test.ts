// Responsável: Rick
import { describe, expect, it } from '@jest/globals';
import { registerUser, loginUser } from '../../src/services/authService';
import { listMatchesForUser } from '../../src/services/matchService';

describe('auth and match services', () => {
  it('registers a user with a favorite team', async () => {
    const result = await registerUser({ name: 'Jane', email: 'jane@example.com', password: 'password123', favoriteTeamSlug: 'corinthians' });
    expect(result.token).toBeTruthy();
    expect(result.user.favoriteTeam!.slug).toBe('corinthians');
  });

  it('rejects invalid login credentials', async () => {
    await expect(loginUser({ email: 'missing@example.com', password: 'password123' })).rejects.toMatchObject({ statusCode: 401 });
  });

  it('filters matches by a favorite team', async () => {
    const matches = await listMatchesForUser({ favoriteTeam: { id: 'team-corinthians', name: 'Corinthians', slug: 'corinthians', logoUrl: 'https://example.com/corinthians.svg' } });
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((match) => match.homeTeam.slug === 'corinthians' || match.awayTeam.slug === 'corinthians')).toBe(true);
  });
});

