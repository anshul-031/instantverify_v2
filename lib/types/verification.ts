import { z } from "zod";

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
  governmentId?: File[];
  personPhoto?: File;
}

export interface VerificationDetails {
  id: string;
  type: VerificationType;
  country: string;
  method: VerificationMethod;
  securityLevel: SecurityLevel;
  documents: VerificationDocuments;
  additionalInfo: {
    aadhaarNumber?: string;
    drivingLicenseNumber?: string;
    voterIdNumber?: string;
    dateOfBirth?: string;
    otp?: string;
  };
  status: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export const verificationSchema = z.object({
  type: z.enum(["tenant", "maid", "driver", "matrimonial", "other"]),
  country: z.string(),
  method: z.enum([
    "aadhaar-otp",
    "driving-license-aadhaar",
    "voter-id-aadhaar",
    "driving-license",
    "voter-id"
  ]),
  documents: z.object({
    governmentId: z.array(z.instanceof(File)).optional(),
    personPhoto: z.instanceof(File).optional(),
  }).optional(),
  aadhaarNumber: z.string().optional(),
  drivingLicenseNumber: z.string().optional(),
  voterIdNumber: z.string().optional(),
  dateOfBirth: z.date().optional(),
});

export type VerificationFormData = z.infer<typeof verificationSchema>;