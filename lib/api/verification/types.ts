import { VerificationDetails, VerificationStatus } from '@/lib/types/verification';

export interface VerificationUpdateData {
  status?: VerificationStatus;
  metadata?: any;
  otpVerified?: boolean;
  otpRequestTime?: Date | null;
  paymentId?: string | null;
  paymentStatus?: string | null;
}

export interface VerificationQueryOptions {
  userId?: string;
  status?: VerificationStatus;
  type?: string;
  method?: string;
}

export class VerificationError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'VerificationError';
  }
}

export class UploadError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'UploadError';
  }
}

export interface ProcessVerificationResult {
  verification: VerificationDetails;
  success: boolean;
  error?: string;
}

export interface UploadParams {
  files: File[];
  type?: 'governmentId' | 'personPhoto';
}

export interface UploadResult {
  urls: string[];
}

export interface SubmitVerificationResult {
  id: string;
  status: VerificationStatus;
}