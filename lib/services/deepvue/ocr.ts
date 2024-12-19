import { makeRequest } from './api';
import { OcrResponse, ExtractedInfo, AadhaarOCRResponse } from '@/lib/types/deepvue';
import logger from '@/lib/utils/logger';

export async function extractAadhaarOcr(documentUrl: string): Promise<ExtractedInfo> {
  logger.debug('Extracting Aadhaar OCR data', { documentUrl });
  
  try {
    // In production, this would make an actual API call
    // For development, we'll use the mock response

    let mockResponse;
    if(process.env.NEXT_PUBLIC_AADHAAR_OCR_API_RESPONSE){
      mockResponse = JSON.parse(process.env.NEXT_PUBLIC_AADHAAR_OCR_API_RESPONSE);
      console.log("Using mock Aadhaar OCR API Response");
    }else{
      // TODO: Call Deepvue AADHAAR OCR  API to fetch EKYC Data 
    }
    
    // Transform the mock response to match our ExtractedInfo interface
    const extractedInfo: ExtractedInfo = {
      name: mockResponse.data.name_on_card,
      address: mockResponse.data.address,
      gender: mockResponse.data.gender,
      dateOfBirth: mockResponse.data.date_of_birth || `${mockResponse.data.year_of_birth}-01-01`,
      fatherName: mockResponse.data.fathers_name,
      photo: '', // Mock response doesn't include photo
      district: mockResponse.data.district,
      state: mockResponse.data.state,
      pincode: mockResponse.data.pincode,
      idNumber: mockResponse.data.id_number
    };

    logger.info('Successfully extracted Aadhaar OCR data', {
      transactionId: mockResponse.transaction_id
    });

    return extractedInfo;
  } catch (error) {
    logger.error('Failed to extract Aadhaar OCR data:', error);
    throw new Error('Failed to extract document information');
  }
}