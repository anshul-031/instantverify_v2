import { VerificationDetails, VerificationStatus } from '@/lib/types/verification';
import { prisma } from '@/lib/db';
import logger from '@/lib/utils/logger';
import { convertVerificationToDetails } from './utils';

export async function processVerification(verification: VerificationDetails): Promise<VerificationDetails> {
  try {
    logger.info('Processing verification', { id: verification.id });

    // Update verification status
    const updatedVerification = await prisma.verification.update({
      where: { id: verification.id },
      data: {
        status: verification.method.includes('aadhaar') ? 'payment-pending' : 'pending',
        updatedAt: new Date(),
      },
    });

    // Convert Prisma model to VerificationDetails type
    return convertVerificationToDetails(updatedVerification);
  } catch (error) {
    logger.error('Verification processing failed:', error);
    throw error;
  }
}