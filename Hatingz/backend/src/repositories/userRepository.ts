import bcrypt from 'bcryptjs';
import { pool } from '../config/database';
import { users } from '../config/store';
import type { User } from '../models';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

type UserRow = Omit<User, 'createdAt'> & { createdAt: string | Date };

function mapUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.passwordHash,
    favoriteTeamId: row.favoriteTeamId,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
  };
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const normalizedEmail = normalizeEmail(email);
  try {
    const [rows] = await pool.execute(
      `SELECT id, name, email, password_hash AS passwordHash, favorite_team_id AS favoriteTeamId, created_at AS createdAt
       FROM users WHERE email = ? LIMIT 1`,
      [normalizedEmail],
    );
    const row = (rows as UserRow[])[0];
    return row ? mapUser(row) : undefined;
  } catch (error) {
    if (!isDatabaseUnavailable(error)) throw error;
    return users.find((user) => user.email.toLowerCase() === normalizedEmail);
  }
}

export async function createUser(input: { name: string; email: string; passwordHash: string; favoriteTeamId: string }): Promise<User> {
  const user: User = {
    id: `user-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: input.name,
    email: normalizeEmail(input.email),
    passwordHash: input.passwordHash,
    favoriteTeamId: input.favoriteTeamId,
    createdAt: new Date().toISOString(),
  };

  try {
    await pool.execute(
      `INSERT INTO users (id, name, email, password_hash, favorite_team_id)
       VALUES (?, ?, ?, ?, ?)`,
      [user.id, user.name, user.email, user.passwordHash, user.favoriteTeamId],
    );
    return user;
  } catch (error) {
    if (!isDatabaseUnavailable(error)) throw error;
    users.push(user);
    return user;
  }
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getUserById(id: string): Promise<User | undefined> {
  try {
    const [rows] = await pool.execute(
      `SELECT id, name, email, password_hash AS passwordHash, favorite_team_id AS favoriteTeamId, created_at AS createdAt
       FROM users WHERE id = ? LIMIT 1`,
      [id],
    );
    const row = (rows as UserRow[])[0];
    return row ? mapUser(row) : undefined;
  } catch (error) {
    if (!isDatabaseUnavailable(error)) throw error;
    return users.find((user) => user.id === id);
  }
}

function isDatabaseUnavailable(error: unknown): boolean {
  const code = (error as { code?: string })?.code;
  return code === 'ECONNREFUSED' || code === 'ENOTFOUND' || code === 'EHOSTUNREACH';
}
