import { accessToken, makeRequest, sessionData, initializeSession } from './api';
import { AadhaarOtpResponse, AadhaarVerifyResponse, ExtractedInfo } from '@/lib/types/deepvue';
import { getMockAadhaarOtpResponse, getMockAadhaarEkycResponse } from './mock';
import logger from '@/lib/utils/logger';

export async function generateAadhaarOtp(
  aadhaarNumber: string,
  captcha: string
): Promise<AadhaarOtpResponse> {
  logger.debug('Generating Aadhaar OTP', { aadhaarNumber });
  
  // In development, return mock response
  // if (process.env.NODE_ENV === 'development') {
  //   await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  //   return getMockAadhaarOtpResponse();
  // }

  const clientSecret = process.env.NEXT_PUBLIC_DEEPVUE_CLIENT_SECRET;

  if (!sessionData?.sessionId) {
    initializeSession();
  }
  const response = await makeRequest<AadhaarOtpResponse>(`https://production.deepvue.tech/v1/ekyc/aadhaar/generate-otp?aadhaar_number=${aadhaarNumber}&captcha=${captcha}&session_id=${sessionData?.sessionId}&consent=Y&purpose=For KYC`, {
    method: 'POST', // Use GET request as parameters are passed in the URL
    headers: {
      'Authorization': `Bearer ${accessToken}`, // Add Authorization header with bearer token
      'x-api-key': `${clientSecret}`,
    },
  });

  if(response.code !== 200) {
    logger.info('otp generation failed')
  }

  return response;
}

/*export async function verifyAadhaarOtp(
  aadhaarNumber: string,
  otp: string
): Promise<AadhaarVerifyResponse> {
  logger.debug('Verifying Aadhaar OTP', { aadhaarNumber });
  
  // In development, return mock response
  if (process.env.NODE_ENV === 'development') {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    return getMockAadhaarEkycResponse();
  }

  return makeRequest<AadhaarVerifyResponse>('/aadhaar/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ aadhaarNumber, otp }),
  });
}

export async function getAadhaarEkyc(
  aadhaarNumber: string,
  otp: string
): Promise<ExtractedInfo> {
  logger.debug('Getting Aadhaar eKYC', { aadhaarNumber });
  
  // In development, return mock response
  if (process.env.NODE_ENV === 'development') {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    const response = getMockAadhaarEkycResponse();
    if (!response.ekycData) {
      throw new Error('Failed to get eKYC data');
    }
    return response.ekycData;
  }

  return makeRequest<ExtractedInfo>('/aadhaar/ekyc', {
    method: 'POST',
    body: JSON.stringify({ aadhaarNumber, otp }),
  });
}*/