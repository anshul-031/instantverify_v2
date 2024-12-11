import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateVerificationReport } from '@/lib/services/verification/report';
import { withLogging } from '@/lib/middleware/logging';
import logger from '@/lib/utils/logger';
import { convertVerificationToDetails } from '@/lib/services/verification/utils';

interface Props {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Props) {
  return withLogging(request, async () => {
    try {
      const verification = await prisma.verification.findUnique({
        where: { id: params.id },
        include: { user: true }
      });

      if (!verification) {
        return NextResponse.json(
          { error: 'Verification not found' },
          { status: 404 }
        );
      }

      // Convert Prisma model to VerificationDetails type
      const verificationDetails = convertVerificationToDetails(verification);
      const report = await generateVerificationReport(verificationDetails);
      
      logger.info('Report generated successfully', { id: params.id });

      return NextResponse.json(report);
    } catch (error) {
      logger.error('Failed to generate report:', error);
      return NextResponse.json(
        { error: 'Failed to generate report' },
        { status: 500 }
      );
    }
  });
}