import { AadhaarOCRResponse, ExtractedInfo } from '@/lib/types/deepvue';
import logger from '@/lib/utils/logger';

export function getMockAadhaarOCRResponse(): AadhaarOCRResponse {
  return require('@/responses/aadhaarOCRAPI.json');
}

export function transformOCRResponse(response: AadhaarOCRResponse): ExtractedInfo {
  logger.debug('Transforming OCR response to ExtractedInfo format');
  
  return {
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
}