import { NextResponse } from 'next/server';
import { verificationSchema } from '@/lib/validations/verification';
import { v4 as uuidv4 } from 'uuid';
import { uploadDocuments } from '@/lib/api/verification';
import { FileData } from '@/lib/types/verification';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Ensure required fields are present
    if (!data.type || !data.country) {
      return NextResponse.json(
        { error: 'Verification type and country are required' },
        { status: 400 }
      );
    }

    // Validate the data against our schema
    const validatedData = verificationSchema.parse(data);

    // Create verification record
    const verification = {
      id: uuidv4(),
      ...validatedData,
      status: 'pending',
      securityLevel: 'most-advanced',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In a real app, save to database here
    
    return NextResponse.json({ 
      success: true,
      verificationId: verification.id 
    });
  } catch (error) {
    console.error('Verification creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create verification request' },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Verification ID is required' },
        { status: 400 }
      );
    }

    // In a real app, fetch from database here
    const verification = {
      id,
      type: 'tenant',
      method: 'aadhaar-otp',
      status: 'pending',
      securityLevel: 'most-advanced',
      documents: {
        governmentId: [],
      },
      additionalInfo: {},
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