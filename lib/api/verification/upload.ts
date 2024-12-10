import { UploadResponse, FileUploadOptions } from './types';
import logger from '@/lib/utils/logger';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export async function uploadFile({ file, onProgress }: FileUploadOptions): Promise<string> {
  try {
    // Validate file
    if (!file) throw new Error('No file provided');
    if (file.size > MAX_FILE_SIZE) throw new Error('File size exceeds 5MB limit');
    if (!ALLOWED_TYPES.includes(file.type)) throw new Error('Invalid file type');

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch("/api/verify/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    const data = await response.json();
    return data.urls[0];
  } catch (error) {
    logger.error('File upload error:', error);
    throw error;
  }
}

export async function uploadDocuments(files: File[]): Promise<UploadResponse> {
  try {
    // Validate files
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File ${file.name} exceeds 5MB limit`);
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error(`File ${file.name} has invalid type`);
      }
    }

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });

    const response = await fetch("/api/verify/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    const data = await response.json();
    logger.info('Documents uploaded successfully', { count: files.length });

    return { urls: data.urls };
  } catch (error) {
    logger.error('Document upload error:', error);
    throw new Error('Failed to upload documents: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}