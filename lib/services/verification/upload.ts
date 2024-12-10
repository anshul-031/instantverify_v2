import { storageService } from '@/lib/services/storage';
import { generateStoragePath } from '@/lib/services/storage/utils';
import logger from '@/lib/utils/logger';
import { VerificationDocuments } from '@/lib/types/verification';
import { UploadParams, UploadResult } from './types/upload';

export async function uploadDocuments({ files, type = 'governmentId' }: UploadParams): Promise<UploadResult> {
  try {
    // Get test user ID (in production, this would come from auth context)
    const userResponse = await fetch('/api/auth/user');
    if (!userResponse.ok) {
      throw new Error('Failed to get user information');
    }
    const user = await userResponse.json();

    // Generate storage path based on document type and user ID
    const storagePath = generateStoragePath(type, user.id);

    // Upload all files to S3
    const uploadPromises = files.map(file => 
      storageService.uploadFile(file, storagePath)
    );

    const uploadResults = await Promise.all(uploadPromises);
    const urls = uploadResults.map(result => result.url);

    logger.info('Documents uploaded successfully', { 
      count: files.length,
      type,
      userId: user.id 
    });

    return { urls };
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