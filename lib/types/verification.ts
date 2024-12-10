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
  // Advanced verifications with OTP
  | "aadhaar-otp"
  | "advanced-aadhaar"
  | "advanced-driving-license"
  | "advanced-voter-id"
  | "advanced-passport"
  | "driving-license-aadhaar"
  | "voter-id-aadhaar"
  // Basic verifications  
  | "basic-driving-license"
  | "basic-voter-id"
  | "basic-passport"
  // Legacy methods for backward compatibility
  | "driving-license"
  | "voter-id";

export interface VerificationMethodInfo {
  id: VerificationMethod;
  name: string;
  description: string;
  requirements: string[];
  prerequisites: string[];
  price: number;
}

export type VerificationStatus = 
  | "pending"
  | "payment-pending"
  | "payment-complete"
  | "verified"
  | "rejected";

export interface ExtractedInfo {
  name: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  photo: string;
  documentNumber: string;
  fatherName?: string;
  motherName?: string;
  spouseName?: string;
  issueDate?: string;
  expiryDate?: string;
  issuingAuthority?: string;
}

export interface FileData {
  name: string;
  size: number;
  type: string;
}

export interface DocumentFiles {
  aadhaarFront?: File;
  aadhaarBack?: File;
  voterIdFront?: File;
  voterIdBack?: File;
  drivingLicenseFront?: File;
  drivingLicenseBack?: File;
  photo?: File;
}

export interface VerificationDocuments {
  governmentId?: FileData[];
  personPhoto?: FileData;
  aadhaarFront?: FileData;
  aadhaarBack?: FileData;
  voterIdFront?: FileData;
  voterIdBack?: FileData;
  drivingLicenseFront?: FileData;
  drivingLicenseBack?: FileData;
}

export interface VerificationFormData {
  type: VerificationType;
  method: VerificationMethod;
  documents: VerificationDocuments;
  photo?: File;
  purpose?: string;
}

export interface VerificationDetails extends VerificationFormData {
  id: string;
  status: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}