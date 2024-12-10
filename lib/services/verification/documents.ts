import { VerificationFormData } from '@/lib/types/verification';
import { FileData } from '@/lib/types/file';
import { VerificationError } from './types';
import logger from '@/lib/utils/logger';

interface PreparedDocuments {
  governmentIdFiles: File[];
  personPhotoFile: File | null;
}

export function prepareDocumentsForUpload(formData: VerificationFormData): PreparedDocuments {
  const governmentIdFiles: File[] = [];
  let personPhotoFile: File | null = null;

  try {
    // Extract government ID files
    if (formData.documents?.governmentId) {
      const files = formData.documents.governmentId
        .map(doc => doc.file)
        .filter((file): file is File => file instanceof File);

      if (files.length === 0) {
        throw new VerificationError(
          'No government ID documents provided',
          'MISSING_DOCUMENTS'
        );
      }

      governmentIdFiles.push(...files);
      logger.debug('Government ID files prepared', { count: files.length });
    }

    // Extract person photo
    if (formData.photo) {
      personPhotoFile = formData.photo;
      logger.debug('Person photo prepared');
    }

    validateDocuments(governmentIdFiles);

    return {
      governmentIdFiles,
      personPhotoFile
    };
  } catch (error) {
    logger.error('Error preparing documents:', error);
    throw error;
  }
}

export function validateDocuments(files: File[]): void {
  if (!files || files.length === 0) {
    throw new VerificationError(
      'No documents provided',
      'MISSING_DOCUMENTS'
    );
  }

  files.forEach((file, index) => {
    if (!(file instanceof File)) {
      throw new VerificationError(
        `Invalid document file at index ${index}`,
        'INVALID_DOCUMENT'
      );
    }

    if (file.size === 0) {
      throw new VerificationError(
        `Empty file detected at index ${index}`,
        'INVALID_DOCUMENT'
      );
    }
  });

  logger.debug('Documents validated successfully', { count: files.length });
}