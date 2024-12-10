import { VerificationFormData } from '@/lib/types/verification';
import { VerificationSubmitResult } from './types/submit';
import { VerificationError } from './types/verification';
import { validateVerificationData } from './validation';
import { prepareVerificationData } from './prepare';
import logger from '@/lib/utils/logger';

export async function submitVerification(formData: VerificationFormData): Promise<VerificationSubmitResult> {
  try {
    logger.debug('Starting verification submission', { 
      method: formData.method,
      type: formData.type 
    });

    // Validate form data
    validateVerificationData(formData);

    // Get test user from API
    const userResponse = await fetch('/api/auth/user');
    if (!userResponse.ok) {
      throw new VerificationError(
        'Failed to get user information',
        'USER_FETCH_FAILED'
      );
    }
    const user = await userResponse.json();

    // Prepare verification data
    const verificationData = await prepareVerificationData(formData, user.id);

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
    logger.info('Verification submitted successfully', { 
      id: data.id,
      type: formData.type,
      method: formData.method 
    });

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