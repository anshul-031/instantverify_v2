import { VerificationMethod } from '@/lib/types/verification';
import logger from '@/lib/utils/logger';

export interface DocumentValidationResult {
  isValid: boolean;
  error?: string;
}

export interface DocumentRequirements {
  maxSize: number;
  allowedTypes: string[];
  minFiles: number;
  maxFiles: number;
}

const DEFAULT_REQUIREMENTS: DocumentRequirements = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  minFiles: 1,
  maxFiles: 2,
};

export function getDocumentRequirements(method: VerificationMethod): DocumentRequirements {
  switch (method) {
    case 'aadhaar-otp':
      return {
        ...DEFAULT_REQUIREMENTS,
        maxFiles: 2, // Front and back
      };
    case 'driving-license':
    case 'driving-license-aadhaar':
      return {
        ...DEFAULT_REQUIREMENTS,
        maxFiles: 4, // DL front/back + Aadhaar front/back
      };
    case 'voter-id':
    case 'voter-id-aadhaar':
      return {
        ...DEFAULT_REQUIREMENTS,
        maxFiles: 4, // Voter ID front/back + Aadhaar front/back
      };
    default:
      return DEFAULT_REQUIREMENTS;
  }
}

export async function validateDocument(
  file: File,
  requirements: DocumentRequirements
): Promise<DocumentValidationResult> {
  try {
    // Check file type
    if (!requirements.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Invalid file type. Allowed types: ${requirements.allowedTypes.join(', ')}`,
      };
    }

    // Check file size
    if (file.size > requirements.maxSize) {
      return {
        isValid: false,
        error: `File size exceeds ${requirements.maxSize / (1024 * 1024)}MB limit`,
      };
    }

    // In production, add more checks:
    // - Image quality assessment
    // - Document authenticity verification
    // - Tampering detection
    await new Promise(resolve => setTimeout(resolve, 500));

    return { isValid: true };
  } catch (error) {
    logger.error('Document validation error:', error);
    return {
      isValid: false,
      error: 'Failed to validate document',
    };
  }
}