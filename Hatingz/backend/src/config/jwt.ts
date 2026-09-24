// Responsável: João
import jwt from 'jsonwebtoken';
import { getEnv } from './env';

const env = getEnv();

export type JwtPayload = {
  userId: string;
  email: string;
};

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: '8h' });
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}

