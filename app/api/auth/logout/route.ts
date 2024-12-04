import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { logout } from '@/lib/auth';
import { withLogging } from '@/lib/middleware/logging';
import logger from '@/lib/utils/logger';

export async function POST(request: Request) {
  return withLogging(request, async () => {
    try {
      await logout();
      logger.info('User logged out successfully');
      return NextResponse.json({ success: true });
    } catch (error) {
      logger.error('Logout error:', error);
      return NextResponse.json(
        { error: 'Logout failed' },
        { status: 500 }
      );
    }
  });
}