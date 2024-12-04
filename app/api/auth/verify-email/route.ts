import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { emailService } from '@/lib/services/email';
import { withLogging } from '@/lib/middleware/logging';
import logger from '@/lib/utils/logger';

export async function POST(request: Request) {
  return withLogging(request, async (req) => {
    try {
      const { token } = await req.json();

      if (!token) {
        logger.warn('Email verification attempted without token');
        return NextResponse.json(
          { error: 'Verification token is required' },
          { status: 400 }
        );
      }

      logger.debug('Email verification attempt', { token });

      // Find user by verification token
      const user = await prisma.user.findUnique({
        where: { emailVerifyToken: token }
      });

      if (!user) {
        logger.warn('Invalid verification token used', { token });
        return NextResponse.json(
          { error: 'Invalid or expired verification token' },
          { status: 400 }
        );
      }

      // Check if email is already verified
      if (user.emailVerified) {
        logger.warn('Already verified email verification attempted', { 
          userId: user.id 
        });
        return NextResponse.json(
          { error: 'Email is already verified' },
          { status: 400 }
        );
      }

      // Update user and clear verification token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          emailVerifyToken: null
        }
      });

      logger.info('Email verified successfully', { userId: user.id });

      // Send welcome email
      await emailService.sendWelcomeEmail(user.email, user.firstName);
      
      logger.info('Welcome email sent', { userId: user.id });

      return NextResponse.json({ 
        success: true,
        message: 'Your email has been successfully verified. You can now log in to your account.'
      });
    } catch (error) {
      logger.error('Email verification error:', error);
      return NextResponse.json(
        { error: 'Failed to verify email. Please try again or contact support.' },
        { status: 500 }
      );
    }
  });
}