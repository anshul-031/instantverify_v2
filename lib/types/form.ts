import { VerificationDocuments, VerificationType, VerificationMethod } from './verification';

export interface FormState {
  type: VerificationType;
  country: string;
  method: VerificationMethod;
  aadhaarNumber: string;
  licenseNumber: string;
  voterIdNumber: string;
  dateOfBirth: string;
  otp: string;
  documents: VerificationDocuments;
  personPhoto?: File;
}

export interface FormProps {
  formData: FormState;
  setFormData: (value: FormState | ((prev: FormState) => FormState)) => void;
  isSubmitting: boolean;
}