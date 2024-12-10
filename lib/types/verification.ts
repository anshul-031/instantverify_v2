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

export interface FileData {
  url: string;
  type: string;
  name: string;
  size: number;
}

export interface VerificationDocuments {
  governmentId?: FileData[];
  personPhoto?: FileData;
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
}

export interface VerificationDetails extends VerificationFormData {
  id: string;
  status: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}