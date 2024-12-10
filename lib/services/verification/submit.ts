import { VerificationFormData } from '@/lib/types/verification';
import { uploadDocuments } from './upload';
import logger from '@/lib/utils/logger';

export async function submitVerification(formData: VerificationFormData) {
  try {
    // Upload documents first
    const documents = await uploadDocuments({
      governmentId: formData.documents.governmentId,
      personPhoto: formData.documents.personPhoto,
      photo: formData.photo
    });

    // Submit verification request
    const response = await fetch('/api/verify/advanced-aadhaar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        documents,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit verification');
    }

    const data = await response.json();
    logger.info('Verification submitted successfully', { id: data.id });

    return {
      id: data.id,
      status: 'pending',
    };
  } catch (error) {
    logger.error('Verification submission error:', error);
    throw error;
  }
}