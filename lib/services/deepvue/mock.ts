import { AadhaarOtpResponse, AadhaarVerifyResponse, ExtractedInfo } from '@/lib/types/deepvue';
import logger from '@/lib/utils/logger';

export function getMockAadhaarOtpResponse(): AadhaarOtpResponse {
  return require('@/responses/generateOtp.json');
}

export function getMockAadhaarEkycResponse(): AadhaarVerifyResponse {
  let ekycData;
  if(process.env.NEXT_PUBLIC_AADHAAR_EKYC_API_RESPONSE){
    ekycData = JSON.parse(process.env.NEXT_PUBLIC_AADHAAR_EKYC_API_RESPONSE);
    console.log("Using mock Aadhaar EKYC API Response");
  }else{
    // TODO: Call Deepvue Aadhaar Ekyc API to fetch EKYC Data 
  }
  return {
    success: true,
    isVerified: true,
    ekycData: {
      name: ekycData.data.name,
      address: ekycData.data.address.careOf + ', ' + ekycData.data.address.locality + ', ' + ekycData.data.address.district + ', ' + ekycData.data.address.state + ' - ' + ekycData.data.address.pin,
      gender: ekycData.data.gender === 'M' ? 'Male' : 'Female',
      dateOfBirth: ekycData.data.dateOfBirth,
      fatherName: ekycData.data.address.careOf.replace('S/O ', ''),
      photo: ekycData.data.photo,
      district: ekycData.data.address.district,
      state: ekycData.data.address.state,
      pincode: ekycData.data.address.pin,
      idNumber: ekycData.data.maskedNumber
    }
  };
}

export function transformOCRResponse(response: any): ExtractedInfo {
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