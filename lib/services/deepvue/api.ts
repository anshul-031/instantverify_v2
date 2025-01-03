import { DEEPVUE_CONFIG, SANDBOX_CONFIG } from './config';
import { AuthResponse, SessionResponse, OcrResponse, ExtractedInfo, AadhaarOtpResponse, SessionData, AadhaarVerifyResponse, InitializeSandboxResponse, GenerateOTPSandboxResponse } from '@/lib/types/deepvue';
import logger from '@/lib/utils/logger';
import { timeStamp } from 'console';
import { Coda } from 'next/font/google';
import { storeOcrData } from './ocr';
import { promises } from 'dns';

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

// Define the DeepvueError class
export class SandboxError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'SandboxError';
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SandboxError);
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
export let referenceId: number | null = 0;


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

export async function extractAadhaarOcr(document1: File, document2: File): Promise<ExtractedInfo> {
  try {
    logger.debug('Starting Aadhaar OCR extraction');
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
   
    const formdata = new FormData();
    formdata.append('files', document1);
    formdata.append('files', document2);

    const requestOptions:RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow"
    };

    const response = await fetch("https://instantverify-aadhaar-ocr.vercel.app/api/aadhaar/gemini", requestOptions);

    if (!response.ok) {
      const error = await response.json();
      throw new DeepvueError(
        error.message || 'API request failed',
        'REQUEST_FAILED',
        new Error(`HTTP ${response.status}`)
      );
    }

    const result = await response.json();
    const extractedInfo: ExtractedInfo = {
      name: result.name,
      address: result.address,
      gender: result.gender,
      dateOfBirth: result.dateOfBirth,
      fatherName: result.fatherName,
      photo: '',
      district: result.addressComponents.district,
      state: result.addressComponents.state,
      pincode: result.addressComponents.pinCode,
      idNumber: result.aadhaarNumber
    };

    // Store extracted info in database using service function
    await fetch('/api/ocr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ extractedInfo })
    });

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
    //Simulate API call
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

export async function verifyAadhaarOtp(otp:string, sessionId:string): Promise<AadhaarVerifyResponse> {

  const clientId = DEEPVUE_CONFIG.CLIENT_ID;
  const clientSecret = DEEPVUE_CONFIG.CLIENT_SECRET;

  try {

    const response = await fetch(`${DEEPVUE_CONFIG.API_BASE}/ekyc/aadhaar/verify-otp?otp=${otp}&session_id=${sessionId}&consent=Y&purpose=For KYC`, {
      method: 'POST', // Use GET request as parameters are passed in the URL
      headers: {
        // Add Authorization header with bearer token
        'client-id': `${clientId}`,
        'x-api-key': `${clientSecret}`,
        'Content-Type':"application/json",
      },
    });

    if (!response.ok) {
      throw new DeepvueError(
        'Failed to Verify OTP',
        'VERIFY_OTP_FAILED',
        new Error(`HTTP ${response.status}`)
      );
    }

    const responseData = await response.json();
    const aadhaarVerifyResponse:AadhaarVerifyResponse = {
      success: responseData.code === 200 ? true : false,
      isVerified: true,
      ekycData: 
      {
        name: responseData.data.name,
        address: responseData.data.address.careOf + ', ' + responseData.data.address.locality + ', ' + responseData.data.address.district + ', ' + responseData.data.address.state + ' - ' + responseData.data.address.pin,
        gender: responseData.data.gender === 'M' ? 'Male' : 'Female',
        dateOfBirth: responseData.data.dateOfBirth,
        fatherName: responseData.data.address.careOf.replace('S/O ', ''),
        photo: responseData.data.photo,
        district: responseData.data.address.district,
        state: responseData.data.address.state,
        pincode: responseData.data.address.pin,
        idNumber: responseData.data.maskedNumber
      }
    }

    if (!aadhaarVerifyResponse.success) {
      throw new Error(aadhaarVerifyResponse.error || 'vaerify otp failed');
    }
  
    logger.info('verify aadhaar OTP successful');
    return aadhaarVerifyResponse;

  }
  catch (error) {
    logger.error('verify addhaar otp failed:', error);
    throw error;
  }
}


//Sandbox Authorize API
export async function authenticateSandbox(): Promise<InitializeSandboxResponse>{
  try {

    const response = await fetch(`${SANDBOX_CONFIG.API_BASE}/authenticate`, {
      method: 'POST', // Use GET request as parameters are passed in the URL
      headers: {
        // Add Authorization header with bearer token
        'x-api-secret': `${SANDBOX_CONFIG.CLIENT_SECRET}`,
        'x-api-key': `${SANDBOX_CONFIG.CLIENT_ID}`,
        'x-api-version':'2.0',
        'accept':"application/json",
      },
    });
  
    if (!response.ok) {
      throw new SandboxError(
        'Failed to initialize Sandbox',
        'SANDBOX_INIT_FAILED',
        new Error(`HTTP ${response.status}`)
      );
    }
  
    const initializeSandboxResponseData = await response.json();
    const initializeSandboxResponse:InitializeSandboxResponse = {
      access_token:initializeSandboxResponseData.access_token
    }
    accessToken = initializeSandboxResponse.access_token
    
    logger.info('SANDBOX Initialization successful');

    return initializeSandboxResponse;
  
  } catch (error) {
    logger.error('SANDBOX Initialization failed:', error);
    throw error;
  } 

}

//Sandbox Authorize API
export async function generateAadhaarOTPSandbox(aadhaarNumber: string): Promise<GenerateOTPSandboxResponse> {

  try {
    if (!accessToken) {
      await authenticateSandbox();
    }

    const response = await fetch(`https://try.readme.io/${SANDBOX_CONFIG.API_BASE}/kyc/aadhaar/okyc/otp`, {
      method: 'POST', 
      headers: {
        'accept': 'application/json',
        'Authorization': `${accessToken}`,
        'x-api-key': `${SANDBOX_CONFIG.CLIENT_ID}`,
        'x-api-version': '2.0',
        'Content-Type': "application/json",
      },
      body: JSON.stringify({
        '@entity': 'in.co.sandbox.kyc.aadhaar.okyc.otp.request',
        'aadhaar_number': `${aadhaarNumber}`,
        'consent': 'y',
        'reason': 'For KYC'
      }),
    });

    // Read the response body once
    const responseData = await response.json();

    //Check if the response is not OK (status code other than 2xx)
    if (!response.ok) {
      throw new SandboxError(
        'Failed to Generate OTP Sandbox',
        'SANDBOX_OTP_FAILED',
        new Error(`HTTP ${responseData.message}`)
      );
    }

    // Use the response data
    const generateAadhaarSandboxResponse: GenerateOTPSandboxResponse = {
      timestamp: responseData.timestamp,
      transaction_id: responseData.transaction_id,
      data: {
        entity: responseData.data['@entity'],
        reference_id: responseData.data.reference_id,
        message: responseData.data.message
      },
      code: responseData.code
    };

    referenceId = generateAadhaarSandboxResponse.data.reference_id || 0;
    if (generateAadhaarSandboxResponse.code !== 200) {
      throw new Error(generateAadhaarSandboxResponse.error || 'OCR extraction failed');
    }

    logger.info('Generate aadhaar OTP successful');
    return generateAadhaarSandboxResponse;

  } catch (error) {
    logger.error('Generate OTP failed:', error);
    throw error;
  }
}

export async function verifyAadhaarOTPSandbox(aadhaarNumber:string, otp: string): Promise<AadhaarVerifyResponse> {
  try {
    if (!accessToken) {
      await authenticateSandbox();
    }

    if (!referenceId) {
      await generateAadhaarOTPSandbox(aadhaarNumber);
    }

    const response = await fetch(`https://try.readme.io/${SANDBOX_CONFIG.API_BASE}/kyc/aadhaar/okyc/otp/verify`, {
      method: 'POST', 
      headers: {
        'accept': 'application/json',
        'authorization': `${accessToken}`,
        'x-api-key': `${SANDBOX_CONFIG.CLIENT_ID}`,
        'x-api-version': '2.0',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        '@entity': 'in.co.sandbox.kyc.aadhaar.okyc.request',
        'reference_id': `${referenceId}`,
        'otp': `${otp}`,
      }),
    });

   // Read the response body once
   const responseData = await response.json();
   
    //Check if the response is not OK (status code other than 2xx)
    if (!response.ok) {
      throw new SandboxError(
        'Failed to verify OTP Sandbox',
        'SANDBOX_VERIFY_OTP_FAILED',
        new Error(`HTTP ${responseData.message}`)
      );
    }

    // Use the response data
    const verifyAadhaarSandboxResponse: AadhaarVerifyResponse = {
      success: responseData.code === 200 ? true : false,
      isVerified: true,
      ekycData: 
      {
        name: responseData.data.name,
        address: responseData.data.full_address,
        gender: responseData.data.gender === 'M' ? 'Male' : 'Female',
        dateOfBirth: responseData.data.date_of_birth,
        fatherName: responseData.data.care_of.replace('S/O ', ''),
        photo: responseData.data.photo,
        district: responseData.data.address.district,
        state: responseData.data.address.state,
        pincode: `${responseData.data.address.pincode}`,
        idNumber: aadhaarNumber
      }
    };

    if (responseData.code !== 200) {
      throw new Error(verifyAadhaarSandboxResponse.error || 'OCR extraction failed');
    }

    logger.info('Generate aadhaar OTP successful');
    return verifyAadhaarSandboxResponse;

  } catch (error) {
    logger.error('Generate OTP failed:', error);
    throw error;
  }
}
