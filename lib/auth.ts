import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
const COOKIE_NAME = 'auth_token';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  exp: number;
  [key: string]: string | number; // Add index signature for JWTPayload compatibility
}

// Mock user for testing
export const MOCK_USER = {
  id: '1',
  email: 'test@example.com',
  password: 'test123', // In production, this would be hashed
  name: 'Test User',
};

export async function login(email: string, password: string, rememberMe: boolean = false) {
  // Mock authentication
  if (email === MOCK_USER.email && password === MOCK_USER.password) {
    const exp = Math.floor(Date.now() / 1000) + (rememberMe ? 30 * 24 * 60 * 60 : 30 * 60); // 30 days or 30 minutes
    const session: UserSession = {
      id: MOCK_USER.id,
      email: MOCK_USER.email,
      name: MOCK_USER.name,
      exp,
    };

    const token = await new SignJWT({ ...session })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(exp)
      .sign(JWT_SECRET);

    return token;
  }
  throw new Error('Invalid credentials');
}

export async function verifyAuth(token: string): Promise<UserSession> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as UserSession;
  } catch (err) {
    throw new Error('Invalid token');
  }
}

export async function logout() {
  cookies().delete(COOKIE_NAME);
}