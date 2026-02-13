import type { UserResponse } from '@/types';

export function getUser(): UserResponse | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('accessToken');
}

export function isAdmin(): boolean {
  const user = getUser();
  return user?.role === 'ADMIN';
}
