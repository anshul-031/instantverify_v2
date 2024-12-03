import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();

    // In a real app, update verification details in database here
    const verification = {
      id,
      ...data,
      status: 'verified',
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(verification);
  } catch (error) {
    console.error('Verification confirmation error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm verification' },
      { status: 500 }
    );
  }
}