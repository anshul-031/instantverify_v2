import { makeRequest } from './api';
import { AuthResponse,OcrResponse, ExtractedInfo } from '@/lib/types/deepvue';
import logger from '@/lib/utils/logger';

export async function extractAadhaarOcr(document1: string, document2: string): Promise<ExtractedInfo> {
  try {
    logger.debug('Starting Aadhaar OCR extraction');
    const clientId = process.env.NEXT_PUBLIC_DEEPVUE_CONFIG;
    const clientSecrete = process.env.NEXT_PUBLIC_DEEPVUE_CONFIG;
    
    const response = await makeRequest<OcrResponse>('/documents/extraction/ind_aadhaar', {
      method: 'POST',
      headers: {
        'x-api-key': `${clientId}`,
        'client-id': `${clientSecrete}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        document1,
        document2,
        name: 'aadhaar'
      })
    });

    if (response.code !== 200) {
      throw new Error(response.error || 'OCR extraction failed');
    }

    // Transform OCR response to ExtractedInfo format
    const extractedInfo: ExtractedInfo = {
      name: response.data.name_on_card,
      address: response.data.address,
      gender: response.data.gender,
      dateOfBirth: response.data.date_of_birth || `${response.data.year_of_birth}-01-01`,
      fatherName: response.data.fathers_name,
      photo: '',
      district: response.data.district,
      state: response.data.state,
      pincode: response.data.pincode,
      idNumber: response.data.id_number
    };

    logger.info('Aadhaar OCR extraction successful');
    return extractedInfo;

  } catch (error) {
    logger.error('Aadhaar OCR extraction failed:', error);
    throw error;
  }
}