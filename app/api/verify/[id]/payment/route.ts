import { NextResponse } from 'next/server';
import { verificationResponseSchema } from '@/lib/validations/verification';
import { paymentService } from '@/lib/services/payment';
import { calculateVerificationPrice } from '@/lib/utils/verification';
import { withLogging } from '@/lib/middleware/logging';
import logger from '@/lib/utils/logger';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withLogging(request, async (req) => {
    try {
      const { id } = params;
      const verification = await req.json();

      logger.debug('Creating payment order', { verificationId: id });

      // Validate verification data
      const validatedData = verificationResponseSchema.parse({
        ...verification,
        id,
        status: 'payment-pending',
        updatedAt: new Date().toISOString(),
      });

      // Calculate price
      const pricing = calculateVerificationPrice(validatedData.method);

      // Create payment order
      const receiptId = `verify_${id.slice(0, 32)}`;
      const order = await paymentService.createOrder({
        amount: pricing.total,
        currency: 'INR',
        receipt: receiptId,
        notes: {
          verificationId: id,
          type: validatedData.type,
          method: validatedData.method,
        },
      });

      logger.info('Payment order created', { 
        orderId: order.id,
        verificationId: id 
      });

      return NextResponse.json({
        ...validatedData,
        payment: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
        },
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    } catch (error) {
      logger.error('Payment initiation error:', error);
      return NextResponse.json(
        { error: 'Failed to initiate payment' },
        { status: 500 }
      );
    }
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withLogging(request, async (req) => {
    try {
      const { id } = params;
      const { orderId, paymentId, signature } = await req.json();

      logger.debug('Verifying payment', { 
        verificationId: id,
        orderId,
        paymentId 
      });

      // Verify payment signature
      const isValid = await paymentService.verifyPayment({
        orderId,
        paymentId,
        signature,
      });

      if (!isValid) {
        logger.warn('Invalid payment signature', { 
          verificationId: id,
          orderId 
        });
        return NextResponse.json(
          { error: 'Invalid payment signature' },
          { status: 400 }
        );
      }

      logger.info('Payment verified successfully', { 
        verificationId: id,
        orderId 
      });

      return NextResponse.json({
        id,
        status: 'payment-complete' as const,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Payment verification error:', error);
      return NextResponse.json(
        { error: 'Failed to verify payment' },
        { status: 500 }
      );
    }
  });
}