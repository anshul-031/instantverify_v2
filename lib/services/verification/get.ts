import { prisma } from '@/lib/db';
import { VerificationDetails, VerificationStatus } from '@/lib/types/verification';
import logger from '@/lib/utils/logger';

export async function getAllVerifications(): Promise<VerificationDetails[]> {
  try {
    const verifications = await prisma.verification.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Convert dates to ISO strings and ensure proper typing
    return verifications.map(verification => ({
      ...verification,
      createdAt: verification.createdAt.toISOString(),
      updatedAt: verification.updatedAt.toISOString(),
      documents: verification.documents as any,
      aadhaarNumber: verification.aadhaarNumber || '',
      otpRequestTime: verification.otpRequestTime?.toISOString() || null,
      status: verification.status as VerificationStatus, // Explicitly type the status
    }));
  } catch (error) {
    logger.error('Failed to fetch verifications:', error);
    throw error;
  }
}

export async function getVerificationById(id: string): Promise<VerificationDetails | null> {
  try {
    const verification = await prisma.verification.findUnique({
      where: { id },
    });

    if (!verification) {
      return null;
    }

    return {
      ...verification,
      createdAt: verification.createdAt.toISOString(),
      updatedAt: verification.updatedAt.toISOString(),
      documents: verification.documents as any,
      aadhaarNumber: verification.aadhaarNumber || '',
      otpRequestTime: verification.otpRequestTime?.toISOString() || null,
      status: verification.status as VerificationStatus, // Explicitly type the status
    };
  } catch (error) {
    logger.error('Failed to fetch verification:', error);
    throw error;
  }
}