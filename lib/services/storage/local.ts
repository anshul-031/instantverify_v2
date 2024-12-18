import { StorageService, UploadResult } from './types';
import { generateUniqueFilename } from './utils';
import logger from '@/lib/utils/logger';

export class LocalStorageService implements StorageService {
  private files: Map<string, File> = new Map();
  private baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  async uploadFile(file: File, path: string): Promise<UploadResult> {
    try {
      const filename = generateUniqueFilename(file.name);
      const key = `${path}/${filename}`;
      
      // Store file in memory
      this.files.set(key, file);
      
      // Generate mock URL
      const url = `${this.baseUrl}/uploads/${key}`;
      
      logger.info('File uploaded to local storage', { key });
      
      return {
        url,
        key,
        filename,
        size: file.size,
        type: file.type,
      };
    } catch (error) {
      logger.error('Local storage upload error:', error);
      throw error;
    }
  }

  async deleteFile(key: string): Promise<void> {
    this.files.delete(key);
    logger.info('File deleted from local storage', { key });
  }

  async getSignedUrl(key: string): Promise<string> {
    // For local storage, we'll just return a direct URL
    return `${this.baseUrl}/uploads/${key}`;
  }
}