export const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: [
    'image/jpeg',
    'image/png', 
    'image/webp',
    'application/pdf'
  ] as const,
  maxFiles: 10,
} as const;

export const UPLOAD_ERRORS = {
  FILE_TOO_LARGE: 'File size exceeds 5MB limit',
  INVALID_TYPE: 'Invalid file type',
  TOO_MANY_FILES: 'Maximum number of files exceeded',
  UPLOAD_FAILED: 'Failed to upload file',
} as const;

export type AllowedFileType = typeof UPLOAD_CONFIG.allowedTypes[number];