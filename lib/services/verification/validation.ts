import { VerificationFormData } from '@/lib/types/verification';
import { VerificationError } from './types/verification';
import logger from '@/lib/utils/logger';

export function validateVerificationData(data: VerificationFormData): void {
  try {
    if (!data.method) {
      throw new VerificationError('Verification method is required', 'INVALID_METHOD');
    }

    if (!data.documents || !data.documents.governmentId?.length) {
      throw new VerificationError('Government ID documents are required', 'MISSING_DOCUMENTS');
    }

    if (!data.documents.personPhoto?.length) {
      throw new VerificationError('Person photo is required', 'MISSING_PHOTO');
    }

    // Method-specific validations
    if (data.method.includes('aadhaar') && !data.aadhaarNumber) {
      throw new VerificationError('Aadhaar number is required', 'MISSING_AADHAAR');
    }

    logger.debug('Verification data validated successfully');
  } catch (error) {
    logger.error('Verification validation error:', error);
    throw error;
  }
}