import { prisma } from '@/lib/db';
import logger from '@/lib/utils/logger';

export async function getOrCreateTestUser() {
  try {
    // Try to find existing test user
    let user = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true
      }
    });

    // Create test user if it doesn't exist
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          phone: '1234567890',
          dateOfBirth: new Date('1990-01-01'),
          password: 'hashed_password', // In production, this should be properly hashed
          emailVerified: true
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true
        }
      });
      logger.info('Created test user', { userId: user.id });
    }

    return user;
  } catch (error) {
    logger.error('Failed to get/create test user:', error);
    throw error;
  }
}