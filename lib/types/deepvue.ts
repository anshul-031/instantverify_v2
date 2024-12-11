export interface AadhaarOCRResponse {
  code: number;
  message: string;
  transaction_id: string;
  data: {
    address: string;
    date_of_birth: string;
    district: string;
    fathers_name: string;
    gender: string;
    house_number: string;
    id_number: string;
    is_scanned: boolean;
    name_on_card: string;
    pincode: string;
    state: string;
    street_address: string;
    year_of_birth: string;
    name_information: {
      name_cleaned: string;
      match_score: number;
      name_provided: string;
    };
  };
}

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