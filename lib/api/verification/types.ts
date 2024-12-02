import { FileData, VerificationFormData } from '@/lib/types/verification';

export interface UploadResponse {
  urls: string[];
}

export interface VerificationResponse {
  success: boolean;
  verificationId: string;
}

export interface FileUploadOptions {
  file: File;
  onProgress?: (progress: number) => void;
}