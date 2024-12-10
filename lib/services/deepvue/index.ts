import { ExtractedInfo } from '@/lib/types/verification';

const DEEPVUE_API_BASE = process.env.DEEPVUE_API_BASE || 'https://api.deepvue.tech/v1';
const DEEPVUE_API_KEY = process.env.DEEPVUE_API_KEY;

interface DeepvueError extends Error {
  code: string;
  status: number;
}

class DeepvueService {
  private async request(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${DEEPVUE_API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${DEEPVUE_API_KEY}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw {
          message: error.message || 'API request failed',
          code: error.code || 'UNKNOWN_ERROR',
          status: response.status,
        } as DeepvueError;
      }

      return response.json();
    } catch (error) {
      console.error('Deepvue API error:', error);
      throw error;
    }
  }

  async generateAadhaarOtp(aadhaarNumber: string, captcha: string) {
    return this.request('/aadhaar/generate-otp', {
      method: 'POST',
      body: JSON.stringify({ aadhaarNumber, captcha }),
    });
  }

  async verifyAadhaarOtp(aadhaarNumber: string, otp: string) {
    return this.request('/aadhaar/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ aadhaarNumber, otp }),
    });
  }

  async getAadhaarEkyc(aadhaarNumber: string, otp: string): Promise<ExtractedInfo> {
    return this.request('/aadhaar/ekyc', {
      method: 'POST',
      body: JSON.stringify({ aadhaarNumber, otp }),
    });
  }

  async extractAadhaarOcr(documentUrl: string): Promise<ExtractedInfo> {
    return this.request('/ocr/aadhaar', {
      method: 'POST',
      body: JSON.stringify({ documentUrl }),
    });
  }

  async matchFaces(image1Url: string, image2Url: string): Promise<number> {
    const response = await this.request('/biometrics/face-match', {
      method: 'POST',
      body: JSON.stringify({ image1Url, image2Url }),
    });
    return response.matchScore;
  }
}

export const deepvueService = new DeepvueService();