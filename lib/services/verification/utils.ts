import { VerificationDocuments, VerificationDetails, VerificationStatus } from '@/lib/types/verification';
import { Prisma, Verification, User } from '@prisma/client';

export function convertVerificationDates(verification: any): any {
  return {
    ...verification,
    createdAt: verification.createdAt.toISOString(),
    updatedAt: verification.updatedAt.toISOString(),
    otpRequestTime: verification.otpRequestTime?.toISOString() || null,
  };
}

export function sanitizeVerificationData(verification: any): any {
  return {
    ...verification,
    aadhaarNumber: verification.aadhaarNumber || '',
    documents: verification.documents || {},
  };
}

export function prepareDocumentsForPrisma(documents: VerificationDocuments): Prisma.JsonValue {
  return JSON.parse(JSON.stringify(documents)) as Prisma.JsonValue;
}

export function convertVerificationToDetails(
  verification: Verification & { user?: User }
): VerificationDetails {
  return {
    id: verification.id,
    type: verification.type,
    method: verification.method,
    status: verification.status as VerificationStatus,
    purpose: verification.purpose,
    documents: verification.documents as VerificationDocuments,
    metadata: verification.metadata,
    otpVerified: verification.otpVerified,
    otpRequestTime: verification.otpRequestTime?.toISOString() || null,
    paymentId: verification.paymentId,
    paymentStatus: verification.paymentStatus,
    aadhaarNumber: verification.aadhaarNumber || '',
    createdAt: verification.createdAt.toISOString(),
    updatedAt: verification.updatedAt.toISOString(),
    userId: verification.userId,
    user: verification.user ? {
      id: verification.user.id,
      email: verification.user.email,
      phone: verification.user.phone,
      firstName: verification.user.firstName,
      lastName: verification.user.lastName,
    } : undefined
  };
}