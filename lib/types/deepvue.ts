import { FileData } from './verification';

export interface ExtractedInfo {
  name: string;
  address: string;
  gender: string;
  dateOfBirth: string;
  fatherName: string;
  photo: string;
  [key: string]: string;
}

export interface AadhaarOtpResponse {
  success: boolean;
  requestId: string;
  message: string;
}

export interface AadhaarVerifyResponse {
  success: boolean;
  isVerified: boolean;
  ekycData?: ExtractedInfo;
}

export interface OcrResponse {
  success: boolean;
  extractedData: ExtractedInfo;
  confidence: number;
}

export interface FaceMatchResponse {
  success: boolean;
  matchScore: number;
  confidence: number;
}

export interface DeepvueError extends Error {
  code: string;
  status: number;
}