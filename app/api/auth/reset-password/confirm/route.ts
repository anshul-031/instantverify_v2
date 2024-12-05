import { NextResponse } from 'next/server';
import { resetPasswordSchema } from '@/lib/validations/auth';
import { confirmPasswordReset } from '@/lib/services/auth/reset-password';
import { withLogging } from '@/lib/middleware/logging';
import logger from '@/lib/utils/logger';

export async function POST(request: Request) {
  return withLogging(request, async (req) => {
    try {
      const data = await req.json();
      const validatedData = resetPasswordSchema.parse(data);
      
      logger.debug('Password reset confirmation attempt', { token: validatedData.token });

      await confirmPasswordReset(validatedData.token, validatedData.password);

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