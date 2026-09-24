import api from './api';
import type { AuthResponse } from '../types/api';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', { email, password });
  localStorage.setItem('ratingz-token', response.data.token);
  localStorage.setItem('ratingz-user', JSON.stringify(response.data.user));
  return response.data;
}

export async function register(name: string, email: string, password: string, favoriteTeamSlug: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', { name, email, password, favoriteTeamSlug });
  localStorage.setItem('ratingz-token', response.data.token);
  localStorage.setItem('ratingz-user', JSON.stringify(response.data.user));
  return response.data;
}

export function logout(): void {
  localStorage.removeItem('ratingz-token');
  localStorage.removeItem('ratingz-user');
}

export function getStoredToken(): string | null {
  return localStorage.getItem('ratingz-token');
}

export function getStoredUser(): AuthResponse['user'] | null {
  const user = localStorage.getItem('ratingz-user');
  if (!user) return null;
  try {
    return JSON.parse(user) as AuthResponse['user'];
  } catch {
    return null;
  }
}
