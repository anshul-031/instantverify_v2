import { VerificationFormData } from '@/lib/types/verification';
import { VerificationSubmitResult } from './types/submit';
import { VerificationError } from './types/verification';
import { getOrCreateTestUser } from '../user';
import logger from '@/lib/utils/logger';

export async function submitVerification(formData: VerificationFormData): Promise<VerificationSubmitResult> {
  try {
    // Get or create test user
    const user = await getOrCreateTestUser();

    // Prepare verification data
    const verificationData = {
      ...formData,
      type: 'tenant', // Default type for now
      userId: user.id,
      verificationMethod: formData.method
    };

    // Submit verification request
    const response = await fetch('/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verificationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new VerificationError(
        errorData.error || 'Failed to submit verification',
        'SUBMISSION_FAILED'
      );
    }

    const data = await response.json();
    logger.info('Verification submitted successfully', { id: data.id });

    return {
      id: data.id,
      status: 'pending'
    };
  } catch (error) {
    logger.error('Verification submission error:', error);
    if (error instanceof VerificationError) {
      throw error;
    }
    throw new VerificationError(
      'Failed to submit verification',
      'UNKNOWN_ERROR',
      error as Error
    );
  }
}