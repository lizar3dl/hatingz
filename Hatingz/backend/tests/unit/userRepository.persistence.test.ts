import { describe, expect, it, jest } from '@jest/globals';

describe('userRepository MySQL persistence', () => {
  it('normalizes email for SQL lookup and maps database rows to User', async () => {
    const execute = jest.fn(async () => [[
      {
        id: 'user-1',
        name: 'Jane',
        email: 'jane@example.com',
        passwordHash: 'hash',
        favoriteTeamId: 'team-corinthians',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
      },
    ]]);
    jest.doMock('../../src/config/database', () => ({ pool: { execute } }));
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    try {
      let findUserByEmail: typeof import('../../src/repositories/userRepository').findUserByEmail;
      jest.isolateModules(() => {
        ({ findUserByEmail } = require('../../src/repositories/userRepository'));
      });

      const user = await findUserByEmail!('  JANE@EXAMPLE.COM ');
      expect(execute).toHaveBeenCalledWith(expect.stringContaining('FROM users WHERE email = ?'), ['jane@example.com']);
      expect(user).toMatchObject({ email: 'jane@example.com', createdAt: '2026-01-01T00:00:00.000Z' });
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
      jest.resetModules();
      jest.dontMock('../../src/config/database');
    }
  });
});
