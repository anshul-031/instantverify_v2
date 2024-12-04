import { NextResponse } from 'next/server';
import { verificationResponseSchema } from '@/lib/validations/verification';
import { generateVerificationReport } from '@/lib/services/verification';
import { withLogging } from '@/lib/middleware/logging';
import logger from '@/lib/utils/logger';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withLogging(request, async (req) => {
    try {
      const { id } = params;
      const data = await req.json();

      logger.debug('Verification confirmation attempt', { verificationId: id });

      // Validate the incoming data
      const validatedData = verificationResponseSchema.parse({
        ...data,
        id,
        status: 'verified',
        updatedAt: new Date().toISOString(),
        createdAt: data.createdAt || new Date().toISOString()
      });

      // In a real app, update verification details in database here
      const verification = {
        ...validatedData,
        status: 'verified' as const,
        updatedAt: new Date().toISOString(),
      };

      // Generate report if verification is complete
      if (verification.status === 'verified') {
        await generateVerificationReport(verification);
        logger.info('Verification report generated', { verificationId: id });
      }

      logger.info('Verification confirmed successfully', { verificationId: id });

      return NextResponse.json(verification);
    } catch (error) {
      logger.error('Verification confirmation error:', error);
      return NextResponse.json(
        { error: 'Failed to confirm verification' },
        { status: 500 }
      );
    }
  });
}