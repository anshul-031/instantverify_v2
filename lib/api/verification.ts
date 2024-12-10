import { VerificationFormData } from '@/lib/types/verification';
import { FileData } from '@/lib/types/file';
import { uploadDocuments } from './verification/upload';
import { submitVerification } from './verification/submit';
import { convertFileToFileData } from './verification/utils';
import { UploadParams, UploadResult, VerificationError } from './verification/types';

// Re-export everything from the modular structure
export * from './verification/types';
export * from './verification/upload';
export * from './verification/submit';
export * from './verification/utils';

// Keep the original functions as wrappers for backward compatibility
export async function submitVerificationRequest(formData: VerificationFormData) {
  return submitVerification(formData);
}

export async function uploadVerificationDocuments(files: File[]): Promise<UploadResult> {
  const params: UploadParams = {
    files,
    type: 'governmentId'
  };
  return uploadDocuments(params);
}

export { convertFileToFileData };