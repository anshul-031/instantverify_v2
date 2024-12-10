import { VerificationFormData } from '@/lib/types/verification';
import { uploadDocuments } from './upload';
import logger from '@/lib/utils/logger';
import { prepareDocumentsForUpload } from './documents';
import { SubmitVerificationResult, VerificationError } from './types';

export async function submitVerification(formData: VerificationFormData): Promise<SubmitVerificationResult> {
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
    const uploadResult = await uploadDocuments({
      files: filesToUpload,
      type: 'governmentId'
    });

    logger.info('Documents uploaded successfully', { urls: uploadResult.urls });

    // Map uploaded URLs back to document structure
    const documents = {
      ...formData.documents,
      governmentId: uploadResult.urls.slice(0, -1).map(url => ({
        url,
        type: "document",
        name: "Government ID",
        size: 0
      })),
      photo: uploadResult.urls[uploadResult.urls.length - 1] ? [{
        url: uploadResult.urls[uploadResult.urls.length - 1],
        type: "photo",
        name: "Person Photo",
        size: 0
      }] : undefined
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