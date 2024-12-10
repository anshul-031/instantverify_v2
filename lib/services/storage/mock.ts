import { StorageService, UploadResult } from './types';
import { generateUniqueFilename } from './utils';
import logger from '@/lib/utils/logger';

export class MockStorageService implements StorageService {
  private files: Map<string, File> = new Map();

  async uploadFile(file: File, path: string): Promise<UploadResult> {
    const filename = generateUniqueFilename(file.name);
    const key = `${path}/${filename}`;
    
    // Store file in memory
    this.files.set(key, file);
    
    // Generate mock URL
    const url = `http://localhost:3000/mock-storage/${key}`;
    
    logger.info('Mock file upload successful', { key });
    
    return {
      url,
      key,
      filename,
      size: file.size,
      type: file.type,
    };
  }

  async deleteFile(key: string): Promise<void> {
    this.files.delete(key);
    logger.info('Mock file deletion successful', { key });
  }

  async getSignedUrl(key: string): Promise<string> {
    return `http://localhost:3000/mock-storage/${key}`;
  }
}