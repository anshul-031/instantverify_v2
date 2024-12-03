import { NextResponse } from 'next/server';
import { verificationSchema } from '@/lib/validations/verification';
import { v4 as uuidv4 } from 'uuid';
import { uploadDocuments } from '@/lib/api/verification';
import { FileData } from '@/lib/types/verification';
import { getSecurityLevelFromMethod } from '@/lib/utils/verification';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Ensure required fields are present
    if (!data.type || !data.country || !data.method) {
      return NextResponse.json(
        { error: 'Required verification details are missing' },
        { status: 400 }
      );
    }

    // Add security level based on method
    const securityLevel = getSecurityLevelFromMethod(data.method);
    const verificationData = {
      ...data,
      securityLevel,
    };

    // Validate the data against our schema
    const validatedData = verificationSchema.parse(verificationData);

    // Create verification record
    const verification = {
      id: uuidv4(),
      ...validatedData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return NextResponse.json({ 
      success: true,
      verificationId: verification.id,
      verification 
    });
  } catch (error) {
    console.error('Verification creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create verification request' },
      { status: 400 }
    );
  }
}