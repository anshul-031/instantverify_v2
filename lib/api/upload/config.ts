export const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  maxFiles: 10,
  uploadDir: 'public/uploads'
};

export const UPLOAD_ERRORS = {
  NO_FILES: 'No files provided',
  FILE_TOO_LARGE: (filename: string) => `File ${filename} exceeds 5MB limit`,
  INVALID_TYPE: (filename: string) => `File ${filename} has invalid type`,
  TOO_MANY_FILES: `Maximum ${UPLOAD_CONFIG.maxFiles} files allowed`,
  UPLOAD_FAILED: 'Failed to upload files'
};