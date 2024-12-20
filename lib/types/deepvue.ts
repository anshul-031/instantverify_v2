// Add new types for auth and session responses
export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface SessionResponse {
  session_id: string;
  status: string;
  message: string;
}

// Update existing types
export interface OcrResponse {
  code: number;
  message:string;
  transaction_id:string;
  error?: string;
  data: {
    
    address: string;
    gender: string;
    date_of_birth?: string;
    fathers_name: string;
    district: string;
    state: string;
    pincode: string;
    id_number: string;
    is_scanned: boolean;
    name_on_card: string;
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
  district: string;
  state: string;
  pincode: string;
  idNumber: string;
  [key: string]: string;
}

export interface AadhaarOtpResponse {
  code: number;
  timestamp:string;
  transaction_id:string;
  sub_code:string;
  message: string;
}

export interface AadhaarVerifyResponse {
  success: boolean;
  isVerified: boolean;
  ekycData?: ExtractedInfo;
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