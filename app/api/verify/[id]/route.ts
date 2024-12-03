import { NextResponse } from 'next/server';
import { verificationResponseSchema } from '@/lib/validations/verification';
import { generateVerificationReport } from '@/lib/services/verification';
import { VerificationDetails } from '@/lib/types/verification';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // In a real app, fetch from database
    const verification: VerificationDetails = {
      id,
      type: 'tenant',
      method: 'aadhaar-otp',
      status: 'verified',
      country: 'IN',
      securityLevel: 'most-advanced',
      documents: {},
      additionalInfo: {
        aadhaarNumber: '123456789012',
        dateOfBirth: '1990-01-01',
        otp: '123456'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(verification);
  } catch (error) {
    console.error('Verification fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verification details' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();
    const validatedData = verificationResponseSchema.parse(data);

    // In a real app, update in database
    const verification: VerificationDetails = {
      ...validatedData,
      id,
      securityLevel: 'most-advanced',
      documents: {},
      additionalInfo: {
        aadhaarNumber: data.additionalInfo?.aadhaarNumber,
        drivingLicenseNumber: data.additionalInfo?.drivingLicenseNumber,
        voterIdNumber: data.additionalInfo?.voterIdNumber,
        dateOfBirth: data.additionalInfo?.dateOfBirth,
        otp: data.additionalInfo?.otp,
      },
      updatedAt: new Date().toISOString(),
    };

    // Generate report if verification is complete
    if (verification.status === 'verified') {
      await generateVerificationReport(verification);
    }

    return NextResponse.json(verification);
  } catch (error) {
    console.error('Verification update error:', error);
    return NextResponse.json(
      { error: 'Failed to update verification' },
      { status: 500 }
    );
  }
}