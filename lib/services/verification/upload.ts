import logger from '@/lib/utils/logger';
import { VerificationDocuments } from '@/lib/types/verification';
import { UploadParams, UploadResult } from './types/upload';

export async function uploadDocuments({ files, type = 'governmentId' }: UploadParams): Promise<UploadResult> {
  try {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const response = await fetch('/api/verify/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload documents');
    }

    const data = await response.json();
    logger.info('Documents uploaded successfully', { count: files.length });

    return { urls: data.urls };
  } catch (error) {
    logger.error('Document upload error:', error);
    throw error;
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