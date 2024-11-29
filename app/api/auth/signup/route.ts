import { NextResponse } from 'next/server';
import { SignUpFormData } from '@/lib/validations/auth';
import { emailService } from '@/lib/services/email';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const data: SignUpFormData = await request.json();
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // TODO: Store user data and verification token in database
    
    // Send verification email
    await emailService.sendVerificationEmail(data.email, verificationToken);
    
    return NextResponse.json({ 
      success: true,
      message: process.env.NODE_ENV === 'development' 
        ? 'Check the console for the verification email'
        : 'Please check your email to verify your account'
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}