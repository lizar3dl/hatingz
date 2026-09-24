// Responsável: João
import bcrypt from 'bcryptjs';
import { teams } from '../config/store';
import { signJwt } from '../config/jwt';
import { ApiError } from '../middlewares/errorHandler';
import { serializeUser } from '../models/serializers';
import { validateLoginInput, validateRegisterInput } from '../models/validators';
import { getTeamBySlug } from '../repositories/teamRepository';
import { createUser, findUserByEmail, getUserById, verifyPassword } from '../repositories/userRepository';
import type { Team, User } from '../models';

export async function registerUser(data: { name: string; email: string; password: string; favoriteTeamSlug: string; }) {
  const validation = validateRegisterInput(data);
  if (!validation.isValid) {
    throw new ApiError(400, 'VALIDATION_ERROR', validation.errors.join(', '));
  }

  const existingUser = await findUserByEmail(data.email);
  if (existingUser) {
    throw new ApiError(409, 'EMAIL_ALREADY_EXISTS', 'Email already registered');
  }

  const team = await getTeamBySlug(data.favoriteTeamSlug);
  if (!team) {
    throw new ApiError(400, 'INVALID_TEAM', 'Selected team is not supported');
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await createUser({
    name: data.name,
    email: data.email,
    passwordHash,
    favoriteTeamId: team.id,
  });

  const token = signJwt({ userId: user.id, email: user.email });
  return {
    token,
    user: serializeUser({ ...user, favoriteTeam: team }),
  };
}

export async function loginUser(data: { email: string; password: string; }) {
  const validation = validateLoginInput(data);
  if (!validation.isValid) {
    throw new ApiError(400, 'VALIDATION_ERROR', validation.errors.join(', '));
  }

  const user = await findUserByEmail(data.email);
  if (!user) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid credentials');
  }

  const passwordValid = await verifyPassword(data.password, user.passwordHash);
  if (!passwordValid) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid credentials');
  }

  const favoriteTeam = teams.find((team) => team.id === user.favoriteTeamId) ?? teams[0];
  const token = signJwt({ userId: user.id, email: user.email });
  return {
    token,
    user: serializeUser({ ...user, favoriteTeam }),
  };
}

export async function getAuthenticatedUser(userId: string): Promise<(User & { favoriteTeam: Team }) | undefined> {
  const user = await getUserById(userId);
  if (!user) return undefined;
  const favoriteTeam = teams.find((team) => team.id === user.favoriteTeamId);
  if (!favoriteTeam) return undefined;
  return { ...user, favoriteTeam };
}

