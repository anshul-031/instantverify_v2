import { VerificationMethod } from '@/lib/types/verification';
import { DocumentRequirement } from '../types';
import { aadhaarRequirements } from './aadhaar';
import { drivingLicenseRequirements } from './driving-license';
import { voterIdRequirements } from './voter-id';
import { passportRequirements } from './passport';

export const documentRequirements: Record<VerificationMethod, DocumentRequirement> = {
  ...aadhaarRequirements,
  ...drivingLicenseRequirements,
  ...voterIdRequirements,
  ...passportRequirements
} as Record<VerificationMethod, DocumentRequirement>;

export function getDocumentRequirement(method: VerificationMethod): DocumentRequirement {
  return documentRequirements[method];
}