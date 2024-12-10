import { prisma } from '@/lib/db';
import { VerificationSchemaType } from '@/lib/validations/verification';
import { VerificationStatus } from '@/lib/types/verification';
import { VerificationResult } from './types';
import { convertVerificationDates, sanitizeVerificationData } from './utils';
import logger from '@/lib/utils/logger';
import { Prisma } from '@prisma/client';

export async function createVerification(data: VerificationSchemaType): Promise<VerificationResult> {
  try {
    const initialStatus: VerificationStatus = 'pending';

    // Prepare documents for Prisma JSON storage
    const documentsJson = data.documents ? 
      Prisma.JsonNull : 
      Prisma.JsonNull;

    // Create the verification data object with proper typing
    const verificationData: Prisma.VerificationCreateInput = {
      type: data.type,
      method: data.method,
      status: initialStatus,
      purpose: data.type === 'other' ? (data.purpose || null) : null,
      documents: data.documents as Prisma.InputJsonValue,
      aadhaarNumber: data.aadhaarNumber || null,
      metadata: {} as Prisma.InputJsonValue,
      otpVerified: false,
      otpRequestTime: null,
      paymentId: null,
      paymentStatus: null,
      user: {
        connect: {
          id: data.userId
        }
      }
    };

    // Verify user exists before creating verification
    const user = await prisma.user.findUnique({
      where: { id: data.userId }
    });

    if (!user) {
      throw new Error(`User not found with ID: ${data.userId}`);
    }

    const verification = await prisma.verification.create({
      data: verificationData,
    });

    // Convert dates and sanitize data for the response
    const processedVerification = convertVerificationDates(verification);
    const result = sanitizeVerificationData(processedVerification);

    logger.info('Verification created successfully', { id: result.id });

    return result;
  } catch (error) {
    logger.error('Failed to create verification:', error);
    throw error;
  }
}