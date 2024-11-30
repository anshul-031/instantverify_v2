import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db';
import { resetPasswordRequestSchema } from '@/lib/validations/auth';
import { emailService } from '@/lib/services/email';
import { generatePasswordResetToken } from '@/lib/auth/token';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validatedData = resetPasswordRequestSchema.parse(data);
    const headersList = headers();
    const host = headersList.get('host') || '';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    
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

      // Send reset email with dynamic base URL
      const resetUrl = `${baseUrl}/reset-password/confirm?token=${resetToken}`;
      await emailService.sendPasswordResetEmail(validatedData.email, resetUrl);
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