export interface UploadResult {
  url: string;
  key: string;
  filename: string;
  size: number;
  type: string;
}

export interface StorageService {
  uploadFile(file: File, path: string): Promise<UploadResult>;
  deleteFile(key: string): Promise<void>;
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
}

export class StorageError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'StorageError';
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StorageError);
    }

    // Preserve original error stack if available
    if (originalError?.stack) {
      this.stack = `${this.stack}\nCaused by: ${originalError.stack}`;
    }
  }
}