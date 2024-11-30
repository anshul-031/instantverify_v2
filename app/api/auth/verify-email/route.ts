import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { emailService } from '@/lib/services/email';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find user by verification token
    const user = await prisma.user.findUnique({
      where: { emailVerifyToken: token }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Check if email is already verified
    if (user.emailVerified) {
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

    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.firstName);

    return NextResponse.json({ 
      success: true,
      message: 'Your email has been successfully verified. You can now log in to your account.'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    
    return NextResponse.json(
      { error: 'Failed to verify email. Please try again or contact support.' },
      { status: 500 }
    );
  }
}