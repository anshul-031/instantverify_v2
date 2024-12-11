import { VerificationDetails } from '@/lib/types/verification';
import { VerificationReport } from '@/lib/types/report';
import logger from '@/lib/utils/logger';

export async function generateVerificationReport(verification: VerificationDetails): Promise<VerificationReport> {
  try {
    logger.info('Generating verification report', { id: verification.id });

    const { ekycData, faceMatchScore } = verification.metadata || {};

    const report: VerificationReport = {
      id: verification.id,
      trackingId: `VR-${verification.id.slice(0, 8)}`,
      verificationDetails: verification,
      idVerification: {
        isVerified: true,
        extractedInfo: ekycData || {
          name: 'John Doe',
          address: '123 Main St, City, State',
          gender: 'Male',
          dateOfBirth: '1990-01-01',
          fatherName: 'James Doe',
          photo: verification.documents?.personPhoto?.[0]?.url || '',
        },
        matchedInfo: {
          name: true,
          address: true,
          gender: true,
          dateOfBirth: true,
          fatherName: true,
          photo: faceMatchScore > 80,
        },
        confidence: faceMatchScore || 98,
      },
      locationInfo: {
        latitude: 28.6139,
        longitude: 77.2090,
        address: 'New Delhi, India',
        timestamp: new Date().toISOString(),
      },
      backgroundCheck: {
        courtRecords: generateMockCourtRecords(),
        defaulterRecords: [],
        firRecords: [],
      },
      generatedAt: new Date().toISOString(),
      status: 'complete',
    };

    logger.info('Report generated successfully', { id: verification.id });

    return report;
  } catch (error) {
    logger.error('Report generation failed:', error);
    throw error;
  }
}

function generateMockCourtRecords() {
  const courts = [
    'Delhi High Court',
    'Mumbai High Court',
    'Bangalore Civil Court',
    'Chennai Metropolitan Court'
  ];

  const types = [
    'Civil Case',
    'Criminal Case',
    'Property Dispute',
    'Family Matter'
  ];

  const statuses = [
    'Pending',
    'Disposed',
    'Under Trial',
    'Closed'
  ];

  return Array.from({ length: 25 }, (_, i) => ({
    court: courts[Math.floor(Math.random() * courts.length)],
    type: types[Math.floor(Math.random() * types.length)],
    caseNumber: `CASE/${2024-Math.floor(Math.random() * 5)}/${1000 + i}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    description: 'Mock court record for demonstration purposes'
  }));
}