import { UPLOAD_CONFIG, UPLOAD_ERRORS } from './config';
import { UploadError } from '../types';
import logger from '@/lib/utils/logger';

export function validateFile(file: File): void {
  if (file.size > UPLOAD_CONFIG.maxFileSize) {
    logger.warn('File size validation failed', { size: file.size, name: file.name });
    throw new UploadError(
      UPLOAD_ERRORS.FILE_TOO_LARGE,
      'FILE_TOO_LARGE'
    );
  }

  if (!UPLOAD_CONFIG.allowedTypes.includes(file.type as typeof UPLOAD_CONFIG.allowedTypes[number])) {
    logger.warn('File type validation failed', { type: file.type, name: file.name });
    throw new UploadError(
      UPLOAD_ERRORS.INVALID_TYPE,
      'INVALID_TYPE'
    );
  }
}

export function validateFiles(files: File[]): void {
  if (files.length > UPLOAD_CONFIG.maxFiles) {
    logger.warn('Too many files', { count: files.length });
    throw new UploadError(
      UPLOAD_ERRORS.TOO_MANY_FILES,
      'TOO_MANY_FILES'
    );
  }

  files.forEach(validateFile);
}