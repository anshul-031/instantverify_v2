import { UploadResponse, UploadedFile } from '@/lib/types/upload';
import { VerificationDocuments } from '@/lib/types/verification';
import logger from '@/lib/utils/logger';

export async function uploadFiles(files: File[]): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const response = await fetch('/api/verify/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Upload failed');
    }

    const result = await response.json();
    logger.info('Files uploaded successfully', { count: files.length });
    return result;
  } catch (error) {
    logger.error('File upload error:', error);
    throw error;
  }
}

export function createFileData(url: string, file: File): UploadedFile {
  return {
    url,
    type: "document",
    name: file.name,
    size: file.size
  };
}

export function convertToVerificationDocuments(urls: string[], files: File[]): VerificationDocuments {
  return {
    governmentId: urls.map((url, index) => createFileData(url, files[index]))
  };
}