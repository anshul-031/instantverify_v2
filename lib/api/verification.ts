import { FileData, VerificationFormData } from '@/lib/types/verification';
import { uploadDocuments } from './verification/upload';
import { submitVerification } from './verification/submit';
import { convertFileToFileData } from './verification/utils';

// Re-export everything from the modular structure
export * from './verification/types';
export * from './verification/upload';
export * from './verification/submit';
export * from './verification/utils';

// Keep the original functions as wrappers for backward compatibility
export async function submitVerificationRequest(formData: VerificationFormData) {
  return submitVerification(formData);
}

export async function uploadVerificationDocuments(files: File[]) {
  return uploadDocuments(files);
}

export { convertFileToFileData };