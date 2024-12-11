import { makeRequest } from './api';
import { AadhaarOtpResponse, AadhaarVerifyResponse, ExtractedInfo } from '@/lib/types/deepvue';
import { getMockAadhaarOtpResponse, getMockAadhaarEkycResponse } from './mock';
import logger from '@/lib/utils/logger';

export async function generateAadhaarOtp(
  aadhaarNumber: string,
  captcha: string
): Promise<AadhaarOtpResponse> {
  logger.debug('Generating Aadhaar OTP', { aadhaarNumber });
  
  // In development, return mock response
  if (process.env.NODE_ENV === 'development') {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    return getMockAadhaarOtpResponse();
  }

  return makeRequest<AadhaarOtpResponse>('/aadhaar/generate-otp', {
    method: 'POST',
    body: JSON.stringify({ aadhaarNumber, captcha }),
  });
}

export async function verifyAadhaarOtp(
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
}