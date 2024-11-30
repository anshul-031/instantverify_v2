import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { resetPasswordRequestSchema } from '@/lib/validations/auth';
import { emailService } from '@/lib/services/email';
import { generatePasswordResetToken } from '@/lib/auth/token';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validatedData = resetPasswordRequestSchema.parse(data);
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (user) {
      // Generate and save reset token
      const resetToken = generatePasswordResetToken();
      await prisma.user.update({
        where: { id: user.id },
        data: { resetPasswordToken: resetToken }
      });

      // Send reset email
      await emailService.sendPasswordResetEmail(validatedData.email, resetToken);
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({ 
      success: true,
      message: 'If an account exists with this email, you will receive password reset instructions'
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}