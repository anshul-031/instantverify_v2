import { VerificationDocuments } from '@/lib/types/verification';

export interface UploadParams {
  files: File[];
  type?: 'governmentId' | 'personPhoto';
}

export interface UploadResult {
  urls: string[];
}

export interface UploadError {
  message: string;
  code: string;
}

export interface UploadedDocument {
  url: string;
  type: string;
  name: string;
  size: number;
}

export interface UploadDocumentsResponse {
  documents: VerificationDocuments;
  success: boolean;
  error?: string;
}