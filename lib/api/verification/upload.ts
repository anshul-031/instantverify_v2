import logger from '@/lib/utils/logger';
import { VerificationDocuments } from '@/lib/types/verification';
import { UploadParams, UploadResult, VerificationError } from './types';

export async function uploadDocuments({ files, type = 'governmentId' }: UploadParams): Promise<UploadResult> {
  try {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const response = await fetch('/api/verify/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new VerificationError('Failed to upload documents', 'UPLOAD_FAILED');
    }

    const data = await response.json();
    logger.info('Documents uploaded successfully', { count: files.length });

    return { urls: data.urls };
  } catch (error) {
    logger.error('Document upload error:', error);
    throw error instanceof VerificationError ? error : new VerificationError(
      'Failed to upload documents',
      'UPLOAD_FAILED',
      error as Error
    );
  }
}

export function mapUrlsToDocuments(urls: string[], type: 'governmentId' | 'personPhoto'): VerificationDocuments {
  return {
    [type]: urls.map(url => ({
      url,
      type: "document",
      name: type === 'governmentId' ? 'Government ID' : 'Person Photo',
      size: 0
    }))
  };
}