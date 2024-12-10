import { z } from 'zod';
import { Prisma } from '@prisma/client';

export type VerificationType = 
  | "tenant" 
  | "maid" 
  | "driver" 
  | "matrimonial" 
  | "other";

export type SecurityLevel = 
  | "most-advanced"
  | "medium-advanced"
  | "less-advanced";

export type VerificationMethod =
  | "aadhaar-otp"
  | "advanced-aadhaar"
  | "advanced-driving-license"
  | "advanced-voter-id"
  | "advanced-passport"
  | "driving-license-aadhaar"
  | "voter-id-aadhaar"
  | "basic-driving-license"
  | "basic-voter-id"
  | "basic-passport"
  | "driving-license"
  | "voter-id";

export interface VerificationMethodInfo {
  id: VerificationMethod;
  name: string;
  description: string;
  prerequisites: string[];
  requirements: string[];
  price: number;
}

export interface DocumentInfo {
  url: string;
  type: string;
  name: string;
  size: number;
  file?: File;
}

export interface VerificationDocuments {
  governmentId?: DocumentInfo[];
  personPhoto?: DocumentInfo[];
  [key: string]: DocumentInfo[] | undefined; // Add index signature
}

export type VerificationStatus = 
  | "pending"
  | "payment-pending"
  | "payment-complete"
  | "verified"
  | "rejected";

export interface VerificationFormData {
  type: VerificationType;
  method: VerificationMethod;
  documents: VerificationDocuments;
  photo?: File;
  purpose?: string;
  aadhaarNumber?: string;
}

export interface VerificationDetails {
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