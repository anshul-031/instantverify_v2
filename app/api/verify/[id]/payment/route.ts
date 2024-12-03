import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // In a real app, update payment status in database here
    const verification = {
      id,
      status: 'payment-complete',
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(verification);
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}