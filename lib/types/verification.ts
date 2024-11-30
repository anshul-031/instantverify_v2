import { z } from "zod";

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

export interface VerificationDocuments {
  governmentId?: File[] | string[];
  personPhoto?: File | string;
}

export interface VerificationFormData {
  type: VerificationType;
  country: string;
  method: VerificationMethod;
  documents?: VerificationDocuments;
  additionalInfo?: {
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