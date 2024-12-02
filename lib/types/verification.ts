import { z } from 'zod';

// Core verification types
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
  | "driving-license-aadhaar"
  | "voter-id-aadhaar"
  | "driving-license"
  | "voter-id";

export type VerificationStatus = 
  | "pending"
  | "payment-pending"
  | "payment-complete"
  | "verified"
  | "rejected";

export interface FileData {
  name: string;
  size: number;
  type: string;
}

export interface VerificationDocuments {
  governmentId?: (FileData | string)[];
}

export interface VerificationFormData {
  type: VerificationType;
  country: string;
  method: VerificationMethod;
  documents?: VerificationDocuments;
  additionalInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    aadhaarNumber?: string;
    drivingLicenseNumber?: string;
    voterIdNumber?: string;
    dateOfBirth?: string;
    otp?: string;
  };
}

export interface VerificationDetails extends VerificationFormData {
  id: string;
  securityLevel: SecurityLevel;
  status: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}