// Responsável: Rick
import request from 'supertest';
import app from '../../src/app';

describe('auth and match integration', () => {
  it('rejects unauthenticated dashboard access', async () => {
    const response = await request(app).get('/api/matches');
    expect(response.status).toBe(401);
  });

  it('allows a registered user to read matches for their favorite team', async () => {
    const registerResponse = await request(app).post('/api/auth/register').send({
      name: 'Corinthians Fan',
      email: 'fan@example.com',
      password: 'password123',
      favoriteTeamSlug: 'corinthians',
    });

    expect(registerResponse.status).toBe(201);
    const token = registerResponse.body.token;
    const matchesResponse = await request(app).get('/api/matches').set('Authorization', `Bearer ${token}`);
    expect(matchesResponse.status).toBe(200);
    expect(Array.isArray(matchesResponse.body)).toBe(true);
    expect(matchesResponse.body.every((match: any) => match.homeTeam.slug === 'corinthians' || match.awayTeam.slug === 'corinthians')).toBe(true);
  });
});

