import { S3Client } from '@aws-sdk/client-s3';
import { s3Config } from '@/lib/config/s3';
import { validateS3Config } from '@/lib/validations/s3';
import { S3StorageService } from './s3';
import { MockStorageService } from './mock';
import { StorageService } from './types';
import logger from '@/lib/utils/logger';

let storageServiceInstance: StorageService | null = null;

export function getStorageService(): StorageService {
  if (!storageServiceInstance) {
    const { isValid, errors } = validateS3Config();
    
    if (!isValid) {
      logger.warn('Using mock storage service - S3 not configured:', { errors });
      storageServiceInstance = new MockStorageService();
    } else {
      const s3Client = new S3Client({
        region: s3Config.region,
        credentials: s3Config.credentials,
      });
      storageServiceInstance = new S3StorageService(s3Client, s3Config);
    }
  }
  
  return storageServiceInstance;
}

export const storageService = getStorageService();

export * from './types';
export * from './utils';