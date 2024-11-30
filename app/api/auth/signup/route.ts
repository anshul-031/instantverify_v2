import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { SignUpFormData } from '@/lib/validations/auth';
import { emailService } from '@/lib/services/email';
import { hashPassword } from '@/lib/auth/password';
import { generateEmailVerificationToken } from '@/lib/auth/token';

export async function POST(request: Request) {
  try {
    const data: SignUpFormData = await request.json();
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { phone: data.phone }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or phone already exists' },
        { status: 400 }
      );
    }

    // Hash password and generate verification token
    const hashedPassword = await hashPassword(data.password);
    const verificationToken = generateEmailVerificationToken();

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        dateOfBirth: new Date(data.dateOfBirth),
        password: hashedPassword,
        emailVerifyToken: verificationToken
      }
    });

    // Send verification email
    await emailService.sendVerificationEmail(data.email, verificationToken);

    return NextResponse.json({ 
      success: true,
      message: 'Please check your email to verify your account'
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}