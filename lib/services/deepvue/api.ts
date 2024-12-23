import { DEEPVUE_CONFIG } from './config';
import { AuthResponse, SessionResponse, OcrResponse, ExtractedInfo, AadhaarOtpResponse, SessionData } from '@/lib/types/deepvue';
import logger from '@/lib/utils/logger';
import { timeStamp } from 'console';
import { Coda } from 'next/font/google';

// Define the DeepvueError class
export class DeepvueError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'DeepvueError';
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DeepvueError);
    }

    // Preserve original error stack if available
    if (originalError?.stack) {
      this.stack = `${this.stack}\nCaused by: ${originalError.stack}`;
    }
  }
}

export let accessToken: string | null = null;
export let sessionData: SessionData | null = null;
export let captcha: string | null = "null";
let sessionInstance: SessionData | null = null;


async function authorize(): Promise<string> {
  try {
    const clientId = DEEPVUE_CONFIG.CLIENT_ID;
    const clientSecret = DEEPVUE_CONFIG.CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new DeepvueError(
        'Missing API credentials',
        'AUTH_CONFIG_ERROR',
        new Error('CLIENT_ID and CLIENT_SECRET must be provided')
      );
    }

    const formData = new FormData();
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);

    const response = await fetch(`${DEEPVUE_CONFIG.API_BASE}/authorize`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new DeepvueError(
        error.message || 'Authorization failed',
        'AUTH_FAILED',
        new Error(`HTTP ${response.status}`)
      );
    }

    const data: AuthResponse = await response.json();
    accessToken = data.access_token;
    logger.info('Deepvue authorization successful');
    
    return accessToken;
  } catch (error) {
    logger.error('Deepvue authorization failed:', error);
    throw error instanceof DeepvueError ? error : new DeepvueError(
      'Authorization failed',
      'AUTH_FAILED',
      error as Error
    );
  }
}

export async function initializeSession(): Promise<SessionData> {
  try {
    const clientId = DEEPVUE_CONFIG.CLIENT_ID;
    const clientSecret = DEEPVUE_CONFIG.CLIENT_SECRET;

    const response = await fetch(`${DEEPVUE_CONFIG.API_BASE}/ekyc/aadhaar/connect?consent=Y&purpose=For KYC`, {
      method: 'GET',
      headers: {
        'x-api-key':`${clientSecret}`,
        'client-id':`${clientId}`,
      }
    });

    if (!response.ok) {
      throw new DeepvueError(
        'Failed to initialize session',
        'SESSION_INIT_FAILED',
        new Error(`HTTP ${response.status}`)
      );
    }

    const data: SessionResponse = await response.json();
    
    captcha = data.data.captcha;
    
    logger.info('Deepvue session initialized');
    const sessData: SessionData = {
      timestamp:data.timestamp,
      transactionId:data.transaction_id,
      sessionId:data.data.session_id,
      captcha:data.data.captcha,
      code:data.code,
    }
    sessionData = sessData;
    sessionInstance = sessionData;
    return sessData;
  } catch (error) {
    logger.error('Session initialization failed:', error);
    throw error instanceof DeepvueError ? error : new DeepvueError(
      'Session initialization failed',
      'SESSION_INIT_FAILED',
      error as Error
    );
  }
}

export async function makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    
    const response = await fetch(`${DEEPVUE_CONFIG.API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Session-ID': sessionData?.sessionId!,
        ...options.headers,
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new DeepvueError(
        error.message || 'API request failed',
        'REQUEST_FAILED',
        new Error(`HTTP ${response.status}`)
      );
    }

    return response.json();
  } catch (error) {
    logger.error('API request failed:', error);
    throw error instanceof DeepvueError ? error : new DeepvueError(
      'API request failed',
      'REQUEST_FAILED',
      error as Error
    );
  }
}

export async function extractAadhaarOcr(document1: string, document2: string): Promise<ExtractedInfo> {
  try {
    if (!accessToken) {
      await authorize();
    }
    logger.debug('Starting Aadhaar OCR extraction');
    const clientId = DEEPVUE_CONFIG.CLIENT_ID;
    const clientSecret = DEEPVUE_CONFIG.CLIENT_SECRET;
   
    const response = await makeRequest<OcrResponse>('/documents/extraction/ind_aadhaar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`, // Add Authorization header with bearer token
        'x-api-key': `${clientSecret}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        document1,
        document2,
        name: 'aadhaar'
      })
    });
    
    if (response.code !== 200) {
      throw new Error(response.error || 'OCR extraction failed');
    }

    // Transform OCR response to ExtractedInfo format
    const extractedInfo: ExtractedInfo = {
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

    logger.info('Aadhaar OCR extraction successful');
    return extractedInfo;

  } catch (error) {
    logger.error('Aadhaar OCR extraction failed:', error);
    throw error;
  }
}

export async function getCaptcha() : Promise<SessionData>{
  if (sessionInstance) {
    return sessionInstance;
  }
  return initializeSession();
}

// Reset session (useful for testing or error recovery)
export function resetSession(): void {
  sessionInstance = null;
}

export async function generateAadhaarOTP(aadhaarNumber:string, captcha:string, sessionId:string): Promise<AadhaarOtpResponse> {
  console.log("generateAadhaarOTP sessionId",sessionId);
  const clientId = DEEPVUE_CONFIG.CLIENT_ID;
  const clientSecret = DEEPVUE_CONFIG.CLIENT_SECRET;

  try {
    // Simulate API call
    const response = await fetch(`${DEEPVUE_CONFIG.API_BASE}/ekyc/aadhaar/generate-otp?aadhaar_number=${aadhaarNumber}&captcha=${captcha}&session_id=${sessionId}&consent=Y&purpose=For KYC`, {
      method: 'POST', // Use GET request as parameters are passed in the URL
      headers: {
        // Add Authorization header with bearer token
        'client-id': `${clientId}`,
        'x-api-key': `${clientSecret}`,
      },
    });

    if (!response.ok) {
      throw new DeepvueError(
        'Failed to Generate OTP',
        'GENERATE_OTP_FAILED',
        new Error(`HTTP ${response.status}`)
      );
    }

    const aadhaarOTPResponse: AadhaarOtpResponse = await response.json();
    
    if (aadhaarOTPResponse.code !== 200) {
      throw new Error(aadhaarOTPResponse.error || 'OCR extraction failed');
    }
  
    logger.info('Generate aadhaar OTP successful');
    return aadhaarOTPResponse;
    
  } catch (error) {
    logger.error('Generate OTP failed:', error);
    throw error;
  } 

}
