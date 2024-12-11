import { NextResponse } from 'next/server';
import { withLogging } from '@/lib/middleware/logging';
import logger from '@/lib/utils/logger';

// Mock response from generateOtp.json
const mockResponse = {
  "code": 200,
  "timestamp": 1732782245867,
  "transaction_id": "920e91af40ef45c589ae140ef26e93f8",
  "sub_code": "SUCCESS",
  "message": "OTP sent to your Registered Mobile number. Check your mobile."
};

export async function POST(request: Request) {
  return withLogging(request, async (req) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      logger.info('Mock OTP generated successfully');
      
      return NextResponse.json(mockResponse);
    } catch (error) {
      logger.error('Failed to generate OTP:', error);
      return NextResponse.json(
        { error: 'Failed to generate OTP' },
        { status: 500 }
      );
    }
  });
}