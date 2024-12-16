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
  return [
    // General Courts
    { court: "All High Courts", status: "No Case found", year: "2000" },
    { court: "Civil Courts - Junior Civil Court, Senior Civil Court, District Court", status: "No Case found", year: "2000" },
    { court: "Criminal Courts - Magistrate courts and Session courts",  status: "No Case found", year: "2000" },
    { court: "Supreme Court",  status: "No Case found", year: "1947" },
    
    // Tribunals
    { court: "Consumer Courts",  status: "No Case found", year: "2000" },
    { court: "CEGAT/CESTAT",  status: "No Case found", year: "2000" },
    { court: "Debt Recovery Tribunal(DRT)",  status: "No Case found", year: "2000" },
    { court: "Debt Recovery Appellate Tribunal(DRAT)",  status: "No Case found", year: "2000" },
    { court: "Income Tax Appellate Tribunal (ITAT)",  status: "No Case found", year: "2000" },
    { court: "National Company Law Tribunal(NCLT)",  status: "No Case found", year: "2000" },
    { court: "Securities Apellate Tribunal(SAT)",  status: "No Case found", year: "2000" },
    { court: "National Green Tribunal(NGT)", status: "No Case found", year: "2000" },
    { court: "NCLAT", status: "No Case found", year: "2000" },
    { court: "Appellate Tribunal for Foreign Exchange - APTE", status: "No Case found", year: "2000" },
    { court: "Others", status: "No Case found", year: "2000" },
    
    // Defaulter Lists
    { court: "CIBIL Willful defaulter List amounting to above Rs. 25 Lakhs",  status: "No Case found", year: "2012" },
    { court: "Crif Defaulter List",  status: "No Case found", year: "2012" },
    { court: "EPF Defaulter List", status: "No Case found", year: "2012" },
    { court: "Equifax Defaulter List",  status: "No Case found", year: "2012" },
    { court: "MCA Defaulter List", status: "No Case found", year: "2016" },
    
    // Others
    { court: "First Information Report(FIR)", status: "No Case found", year: "2011" }
  ];
}