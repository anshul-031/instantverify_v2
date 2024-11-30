import { VerificationDetails } from './verification';

export interface IDVerificationResult {
  isVerified: boolean;
  extractedInfo: {
    name: string;
    address: string;
    gender: string;
    dateOfBirth: string;
    fatherName: string;
    photo: string;
  };
  matchedInfo: {
    name: boolean;
    address: boolean;
    gender: boolean;
    dateOfBirth: boolean;
    fatherName: boolean;
    photo: boolean;
  };
  confidence: number;
}

export interface LocationInfo {
  latitude: number;
  longitude: number;
  address: string;
  timestamp: string;
}

export interface CourtRecord {
  court: string;
  type: string;
  caseNumber?: string;
  year?: string;
  status?: string;
  description?: string;
}

export interface DefaulterRecord {
  source: string;
  amount?: number;
  date?: string;
  status: string;
  description?: string;
}

export interface BackgroundCheckResult {
  courtRecords: CourtRecord[];
  defaulterRecords: DefaulterRecord[];
  firRecords: {
    stationName: string;
    firNumber: string;
    date: string;
    status: string;
    description?: string;
  }[];
}

export interface VerificationReport {
  id: string;
  trackingId: string;
  verificationDetails: VerificationDetails;
  idVerification: IDVerificationResult;
  locationInfo: LocationInfo;
  backgroundCheck: BackgroundCheckResult;
  generatedAt: string;
  status: 'complete' | 'pending' | 'failed';
}