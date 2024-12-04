import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { resetPasswordSchema } from '@/lib/validations/auth';
import { hashPassword } from '@/lib/auth/password';
import { withLogging } from '@/lib/middleware/logging';
import logger from '@/lib/utils/logger';

export async function POST(request: Request) {
  return withLogging(request, async (req) => {
    try {
      const data = await req.json();
      const validatedData = resetPasswordSchema.parse(data);
      
      logger.debug('Password reset confirmation attempt', { token: validatedData.token });

      // Find user by reset token
      const user = await prisma.user.findUnique({
        where: { resetPasswordToken: validatedData.token }
      });

      if (!user) {
        logger.warn('Invalid reset token used', { token: validatedData.token });
        return NextResponse.json(
          { error: 'Invalid or expired reset token' },
          { status: 400 }
        );
      }

      // Hash new password and clear reset token
      const hashedPassword = await hashPassword(validatedData.password);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetPasswordToken: null
        }
      });

      logger.info('Password reset successful', { userId: user.id });

      return NextResponse.json({ 
        success: true,
        message: 'Your password has been successfully reset'
      });
    } catch (error) {
      logger.error('Password reset confirmation error:', error);
      return NextResponse.json(
        { error: 'Failed to reset password' },
        { status: 500 }
      );
    }
  });
}