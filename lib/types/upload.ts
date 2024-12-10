import { VerificationMethod, VerificationDocuments } from './verification';

export interface UploadedFile {
  url: string;
  type: string;
  name: string;
  size: number;
}

export interface UploadResponse {
  urls: string[];
  error?: string;
}

export interface DocumentUploadProps {
  onUpload: (docs: VerificationDocuments) => void;
  maxFiles?: number;
  accept?: string;
  isSubmitting?: boolean;
  existingDocuments?: VerificationDocuments;
  method?: VerificationMethod;
}