import { NextResponse } from 'next/server';
import { resetPasswordRequestSchema } from '@/lib/validations/auth';
import { requestPasswordReset } from '@/lib/services/auth/reset-password';
import { withLogging } from '@/lib/middleware/logging';
import logger from '@/lib/utils/logger';

export async function POST(request: Request) {
  return withLogging(request, async (req) => {
    try {
      const data = await req.json();
      const validatedData = resetPasswordRequestSchema.parse(data);
      
      logger.debug('Password reset request', { email: validatedData.email });

      await requestPasswordReset(validatedData.email);

      return NextResponse.json({ 
        success: true,
        message: 'If an account exists with this email, you will receive password reset instructions'
      });
    } catch (error) {
      logger.error('Password reset request error:', error);
      return NextResponse.json(
        { error: 'Failed to process password reset request' },
        { status: 500 }
      );
    }
  });
}