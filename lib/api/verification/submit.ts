import { VerificationFormData } from '@/lib/types/verification';
import { uploadDocuments } from './upload';
import logger from '@/lib/utils/logger';

export async function submitVerification(formData: VerificationFormData) {
  try {
    logger.info('Starting verification submission');

    // Prepare files for upload
    const filesToUpload: File[] = [];
    
    if (formData.documents.governmentId) {
      filesToUpload.push(...formData.documents.governmentId.map(doc => doc as unknown as File));
    }
    
    if (formData.photo) {
      filesToUpload.push(formData.photo);
    }

    // Upload documents first
    const uploadResult = await uploadDocuments(filesToUpload);
    logger.info('Documents uploaded successfully', { urls: uploadResult.urls });

    // Map uploaded URLs back to document structure
    const documents = {
      ...formData.documents,
      governmentId: uploadResult.urls.slice(0, -1), // All except last URL
      photo: uploadResult.urls[uploadResult.urls.length - 1], // Last URL is the photo
    };

    // Submit verification request
    const response = await fetch('/api/verify', {
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
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit verification');
    }

    const data = await response.json();
    logger.info('Verification submitted successfully', { id: data.id });

    return {
      id: data.id,
      status: 'pending' as const,
    };
  } catch (error) {
    logger.error('Verification submission error:', error);
    throw new Error('Failed to submit verification: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}