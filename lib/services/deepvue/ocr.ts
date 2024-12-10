import { makeRequest } from './api';
import { OcrResponse, ExtractedInfo } from '@/lib/types/deepvue';
import logger from '@/lib/utils/logger';

export async function extractAadhaarOcr(documentUrl: string): Promise<ExtractedInfo> {
  logger.debug('Extracting Aadhaar OCR data', { documentUrl });
  const response = await makeRequest<OcrResponse>('/ocr/aadhaar', {
    method: 'POST',
    body: JSON.stringify({ documentUrl }),
  });
  return response.extractedData;
}