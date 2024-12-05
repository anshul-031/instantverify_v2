import { prisma } from '@/lib/db';
import { emailService } from '@/lib/services/email';
import { generatePasswordResetToken } from '@/lib/auth/token';
import { hashPassword } from '@/lib/auth/password';
import logger from '@/lib/utils/logger';

export async function requestPasswordReset(email: string): Promise<void> {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      logger.warn('Password reset requested for non-existent user', { email });
      return;
    }

    const resetToken = generatePasswordResetToken();
    
    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: resetToken }
    });

    await emailService.sendPasswordResetEmail(email, resetToken);
    
    logger.info('Password reset email sent', { userId: user.id });
  } catch (error) {
    logger.error('Password reset request error:', error);
    throw new Error('Failed to process password reset request');
  }
}

export async function confirmPasswordReset(token: string, newPassword: string): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { resetPasswordToken: token }
    });

    if (!user) {
      logger.warn('Invalid reset token used', { token });
      throw new Error('Invalid or expired reset token');
    }

    const hashedPassword = await hashPassword(newPassword);
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null
      }
    });

    logger.info('Password reset successful', { userId: user.id });
  } catch (error) {
    logger.error('Password reset confirmation error:', error);
    throw error;
  }
}