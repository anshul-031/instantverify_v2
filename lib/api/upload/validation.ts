import { UPLOAD_CONFIG, UPLOAD_ERRORS } from './config';

export function validateFile(file: File): string | null {
  if (file.size > UPLOAD_CONFIG.maxFileSize) {
    return UPLOAD_ERRORS.FILE_TOO_LARGE(file.name);
  }
  
  if (!UPLOAD_CONFIG.allowedTypes.includes(file.type)) {
    return UPLOAD_ERRORS.INVALID_TYPE(file.name);
  }

  return null;
}

export function validateFiles(files: File[]): string | null {
  if (!files || files.length === 0) {
    return UPLOAD_ERRORS.NO_FILES;
  }

  if (files.length > UPLOAD_CONFIG.maxFiles) {
    return UPLOAD_ERRORS.TOO_MANY_FILES;
  }

  for (const file of files) {
    const error = validateFile(file);
    if (error) return error;
  }

  return null;
}