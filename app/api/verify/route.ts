import { NextResponse } from 'next/server';
import { withLogging } from '@/lib/middleware/logging';
import { verificationSchema } from '@/lib/validations/verification';
import { createVerification } from '@/lib/services/verification/create';
import { processVerification } from '@/lib/services/verification/process';
import { getAllVerifications } from '@/lib/services/verification/get';
import logger from '@/lib/utils/logger';

export async function POST(request: Request) {
  return withLogging(request, async (req) => {
    try {
      const data = await req.json();
      
      // Validate the request data
      const validatedData = verificationSchema.parse({
        ...data,
        documents: {
          ...data.documents,
          governmentId: data.documents?.governmentId?.map((doc: any) => ({
            ...doc,
            url: doc.url ? new URL(doc.url, process.env.NEXT_PUBLIC_APP_URL).toString() : undefined
          })),
          personPhoto: data.documents?.personPhoto?.map((doc: any) => ({
            ...doc,
            url: doc.url ? new URL(doc.url, process.env.NEXT_PUBLIC_APP_URL).toString() : undefined
          }))
        }
      });
      
      logger.debug('Processing verification request', { type: validatedData.type });

      try {
        // Create initial verification record
        const verification = await createVerification(validatedData);
        logger.info('Verification created', { id: verification.id });

        // Process the verification
        const processedVerification = await processVerification(verification);
        logger.info('Verification processed', { 
          id: verification.id, 
          status: processedVerification.status 
        });

        return NextResponse.json({
          success: true,
          id: verification.id,
          status: processedVerification.status,
        });
      } catch (error) {
        logger.error('Verification processing failed:', error);
        return NextResponse.json(
          { error: error instanceof Error ? error.message : 'Failed to process verification' },
          { status: 500 }
        );
      }
    } catch (error) {
      logger.error('Verification request validation failed:', error);
      return NextResponse.json(
        { error: 'Invalid verification request' },
        { status: 400 }
      );
    }
  });
}

export async function GET(request: Request) {
  return withLogging(request, async () => {
    try {
      const verifications = await getAllVerifications();
      return NextResponse.json({ verifications });
    } catch (error) {
      logger.error('Failed to fetch verifications:', error);
      return NextResponse.json(
        { error: 'Failed to fetch verifications' },
        { status: 500 }
      );
    }
  });
}