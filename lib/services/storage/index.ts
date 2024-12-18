import { S3Client } from '@aws-sdk/client-s3';
import { s3Config } from '@/lib/config/s3';
import { validateS3Config } from '@/lib/validations/s3';
import { S3StorageService } from './s3';
import { LocalStorageService } from './local';
import { StorageService } from './types';
import logger from '@/lib/utils/logger';

let storageServiceInstance: StorageService | null = null;

export function getStorageService(): StorageService {
  if (!storageServiceInstance) {
    const { isValid } = validateS3Config();
    
    if (!isValid) {
      logger.warn('Invalid S3 configuration - falling back to local storage');
      storageServiceInstance = new LocalStorageService();
    } else {
      logger.info('Initializing S3 storage service');
      storageServiceInstance = new S3StorageService(s3Config);
    }
  }
  
  return storageServiceInstance;
}

export const storageService = getStorageService();

export * from './types';
export * from './utils';