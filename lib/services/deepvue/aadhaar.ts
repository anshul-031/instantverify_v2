import { makeRequest } from './api';
import { AadhaarOtpResponse, AadhaarVerifyResponse, ExtractedInfo } from '@/lib/types/deepvue';
import logger from '@/lib/utils/logger';

export async function generateAadhaarOtp(
  aadhaarNumber: string,
  captcha: string
): Promise<AadhaarOtpResponse> {
  logger.debug('Generating Aadhaar OTP', { aadhaarNumber });
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
  return makeRequest<ExtractedInfo>('/aadhaar/ekyc', {
    method: 'POST',
    body: JSON.stringify({ aadhaarNumber, otp }),
  });
}