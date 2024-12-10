import logger from '@/lib/utils/logger';
import { FileData, VerificationDocuments } from '@/lib/types/verification';

interface UploadParams {
  governmentId?: FileData[];
  personPhoto?: FileData;
  photo?: File;
}

export async function uploadDocuments(params: UploadParams): Promise<VerificationDocuments> {
  try {
    const formData = new FormData();
    
    if (params.governmentId) {
      params.governmentId.forEach((doc, index) => {
        formData.append(`governmentId[${index}]`, JSON.stringify(doc));
      });
    }

    if (params.personPhoto) {
      formData.append('personPhoto', JSON.stringify(params.personPhoto));
    }

    if (params.photo) {
      formData.append('photo', params.photo);
    }

    const response = await fetch('/api/verify/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload documents');
    }

    const data = await response.json();
    logger.info('Documents uploaded successfully');

    return {
      governmentId: data.governmentId,
      personPhoto: data.personPhoto,
    };
  } catch (error) {
    logger.error('Document upload error:', error);
    throw error;
  }
}