import { NextResponse } from 'next/server';
import { getOrCreateTestUser } from '@/lib/services/user';
import { withLogging } from '@/lib/middleware/logging';
import logger from '@/lib/utils/logger';

export async function GET(request: Request) {
  return withLogging(request, async () => {
    try {
      const user = await getOrCreateTestUser();
      return NextResponse.json(user);
    } catch (error) {
      logger.error('Failed to get/create test user:', error);
      return NextResponse.json(
        { error: 'Failed to get user' },
        { status: 500 }
      );
    }
  });
}