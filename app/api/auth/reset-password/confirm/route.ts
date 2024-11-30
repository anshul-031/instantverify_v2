import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { resetPasswordSchema } from '@/lib/validations/auth';
import { hashPassword } from '@/lib/auth/password';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validatedData = resetPasswordSchema.parse(data);
    
    // Find user by reset token
    const user = await prisma.user.findUnique({
      where: { resetPasswordToken: validatedData.token }
    });

    if (!user) {
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

    return NextResponse.json({ 
      success: true,
      message: 'Your password has been successfully reset'
    });
  } catch (error) {
    console.error('Password reset confirmation error:', error);
    
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}