import { VerificationDocuments, VerificationMethod } from '@/lib/types/verification';

export interface DocumentUploadProps {
  onUpload: (docs: VerificationDocuments) => void;
  maxFiles?: number;
  accept?: string;
  isSubmitting?: boolean;
  existingDocuments?: VerificationDocuments;
  method?: VerificationMethod;
}

export interface FileData {
  url: string;
  type: string;
  name: string;
  size: number;
}

export interface UploadResponse {
  urls: string[];
}

export interface DocumentRequirement {
  title: string;
  description: string;
  maxFiles: number;
}