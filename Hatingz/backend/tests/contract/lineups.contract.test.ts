// Respons?vel: Rick
﻿// Responsável: Rick
import request from 'supertest';
import app from '../../src/app';

describe('lineup contract', () => {
  it('creates a lineup for authenticated access', async () => {
    const registerResponse = await request(app).post('/api/auth/register').send({
      name: 'Lineup User',
      email: 'lineup@example.com',
      password: 'password123',
      favoriteTeamSlug: 'bahia',
    });

    const token = registerResponse.body.token;
    const response = await request(app).post('/api/lineups').set('Authorization', `Bearer ${token}`).send({
      teamSlug: 'bahia',
      formation: '4-3-3',
      playerIds: ['bahia-1', 'bahia-2', 'bahia-3', 'bahia-4', 'bahia-5', 'bahia-6', 'bahia-7', 'bahia-8', 'bahia-9', 'bahia-10', 'bahia-11'],
      isPublished: true,
    });

    expect(response.status).toBe(201);
    expect(response.body.formation).toBe('4-3-3');
    expect(response.body.playerIds).toHaveLength(11);
  });
});

