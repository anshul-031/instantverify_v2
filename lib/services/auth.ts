import { User } from '@/lib/types/auth';

export async function loginUser(email: string, password: string): Promise<User> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  return {
    id: data.user.id,
    email: data.user.email,
    name: data.user.name,
  };
}

export async function logoutUser(): Promise<void> {
  const response = await fetch('/api/auth/logout', { method: 'POST' });
  
  if (!response.ok) {
    throw new Error('Logout failed');
  }
}