import { NextResponse } from 'next/server';
import { razorpayConfig } from '@/lib/config/razorpay';
import Razorpay from 'razorpay';
import logger from '@/lib/utils/logger';

const razorpay = new Razorpay({
  key_id: razorpayConfig.keyId,
  key_secret: razorpayConfig.keySecret,
});

export async function POST(request: Request) {
  try {
    const { amount, currency, receipt } = await request.json();

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to smallest currency unit
      currency,
      receipt,
    });

    logger.info('Razorpay order created:', { orderId: order.id });

    return NextResponse.json(order);
  } catch (error) {
    logger.error('Failed to create Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}