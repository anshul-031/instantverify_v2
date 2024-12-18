import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './db';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '');
const COOKIE_NAME = 'auth_token';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  exp: number;
}

interface JWTPayload {
  id: string;
  email: string;
  name: string;
  exp: number;
}

export async function login(email: string, password: string, rememberMe: boolean = false) {
  const user = await prisma.user.findUnique({ 
    where: { email },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      password: true
    }
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // In production, verify password hash here
  const exp = Math.floor(Date.now() / 1000) + (rememberMe ? 30 * 24 * 60 * 60 : 30 * 60);
  const session: UserSession = {
    id: user.id,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    exp,
  };

  const token = await new SignJWT({ ...session })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(exp)
    .sign(JWT_SECRET);

  return token;
}

export async function verifyAuth(token: string): Promise<UserSession> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload as unknown as JWTPayload;
    
    if (!payload.id || !payload.email || !payload.name || !payload.exp) {
      throw new Error('Invalid token payload');
    }

    // Validate and return as UserSession
    const session: UserSession = {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      exp: payload.exp
    };
    
    return session;
  } catch (err) {
    throw new Error('Invalid token');
  }
}

export async function logout() {
  cookies().delete(COOKIE_NAME);
}