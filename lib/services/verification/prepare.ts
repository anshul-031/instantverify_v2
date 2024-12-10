import { VerificationFormData } from '@/lib/types/verification';
import { VerificationError } from './types/verification';
import logger from '@/lib/utils/logger';

export async function prepareVerificationData(formData: VerificationFormData, userId: string) {
  try {
    // Ensure type is one of the valid verification types
    if (!['tenant', 'maid', 'driver', 'matrimonial', 'other'].includes(formData.type)) {
      throw new VerificationError(
        'Invalid verification type',
        'INVALID_TYPE'
      );
    }

    // Prepare verification data
    const verificationData = {
      ...formData,
      userId,
      documents: {
        ...formData.documents,
        personPhoto: formData.photo ? [{
          type: 'photo',
          name: 'Person Photo',
          size: formData.photo.size,
          file: formData.photo
        }] : undefined
      }
    };

    logger.debug('Verification data prepared successfully', {
      type: verificationData.type,
      method: verificationData.method
    });
    
    return verificationData;
  } catch (error) {
    logger.error('Error preparing verification data:', error);
    throw new VerificationError(
      'Failed to prepare verification data',
      'PREPARATION_FAILED',
      error as Error
    );
  }
}