import { NextResponse } from 'next/server';
import { resetPasswordRequestSchema } from '@/lib/validations/auth';
import { emailService } from '@/lib/services/email';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validatedData = resetPasswordRequestSchema.parse(data);
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // TODO: Store reset token in database with expiration
    // For now, we'll just send the email
    
    await emailService.sendPasswordResetEmail(validatedData.email, resetToken);
    
    return NextResponse.json({ 
      success: true,
      message: process.env.NODE_ENV === 'development' 
        ? 'Check the console for the reset password email'
        : 'If an account exists with this email, you will receive password reset instructions'
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}