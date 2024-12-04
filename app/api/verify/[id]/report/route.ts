import { NextResponse } from 'next/server';
import { VerificationReport } from '@/lib/types/report';
import { withLogging } from '@/lib/middleware/logging';
import logger from '@/lib/utils/logger';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return withLogging(request, async () => {
    try {
      const { id } = params;

      logger.debug('Fetching verification report', { verificationId: id });

      // Mock report data - in production, fetch from database
      const report: VerificationReport = {
        id,
        trackingId: `VR-${id.slice(0, 8)}`,
        verificationDetails: {
          id,
          type: 'tenant',
          method: 'aadhaar-otp',
          status: 'verified',
          country: 'IN',
          securityLevel: 'most-advanced',
          documents: {},
          additionalInfo: {
            aadhaarNumber: '123456789012',
            dateOfBirth: '1990-01-01',
            otp: '123456'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        idVerification: {
          isVerified: true,
          extractedInfo: {
            name: 'John Doe',
            address: '123 Main St, City, State',
            gender: 'Male',
            dateOfBirth: '1990-01-01',
            fatherName: 'James Doe',
            photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d',
          },
          matchedInfo: {
            name: true,
            address: true,
            gender: true,
            dateOfBirth: true,
            fatherName: true,
            photo: true,
          },
          confidence: 98,
        },
        locationInfo: {
          latitude: 28.6139,
          longitude: 77.2090,
          address: 'New Delhi, India',
          timestamp: new Date().toISOString(),
        },
        backgroundCheck: {
          courtRecords: [],
          defaulterRecords: [],
          firRecords: [],
        },
        generatedAt: new Date().toISOString(),
        status: 'complete',
      };

      logger.info('Verification report retrieved', { 
        verificationId: id,
        trackingId: report.trackingId 
      });

      return NextResponse.json(report);
    } catch (error) {
      logger.error('Report generation error:', error);
      return NextResponse.json(
        { error: 'Failed to generate report' },
        { status: 500 }
      );
    }
  });
}