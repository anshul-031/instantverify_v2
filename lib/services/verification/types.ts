import { VerificationStatus, VerificationDocuments } from '@/lib/types/verification';
import { Prisma } from '@prisma/client';

export interface VerificationResult {
  id: string;
  type: string;
  method: string;
  status: VerificationStatus;
  purpose: string | null;
  documents: VerificationDocuments;
  metadata: any;
  otpVerified: boolean;
  otpRequestTime: string | null;
  paymentId: string | null;
  paymentStatus: string | null;
  aadhaarNumber: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
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