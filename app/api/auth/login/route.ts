import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/auth/password';
import { SignJWT } from 'jose';
import { withLogging } from '@/lib/middleware/logging';
import logger from '@/lib/utils/logger';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || '');

export async function POST(request: Request) {
  return withLogging(request, async (req) => {
    try {
      const { email, password, rememberMe } = await req.json();

      logger.debug('Login attempt', { email });

      // Find user
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        logger.warn('Login failed - User not found', { email });
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      // Verify password
      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        logger.warn('Login failed - Invalid password', { email });
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      // Check email verification
      if (!user.emailVerified) {
        logger.warn('Login failed - Email not verified', { email });
        return NextResponse.json(
          { error: 'Please verify your email before logging in' },
          { status: 401 }
        );
      }

      // Generate JWT
      const exp = Math.floor(Date.now() / 1000) + (rememberMe ? 30 * 24 * 60 * 60 : 30 * 60);
      const token = await new SignJWT({ 
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(exp)
        .sign(JWT_SECRET);

      // Set cookie
      cookies().set({
        name: 'auth_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: rememberMe ? 30 * 24 * 60 * 60 : 30 * 60,
      });

      logger.info('Login successful', { userId: user.id, email });

      return NextResponse.json({ 
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      );
    }
  });
}