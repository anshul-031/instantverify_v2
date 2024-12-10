import { VerificationStatus } from '@/lib/types/verification';

export interface VerificationSubmitResult {
  id: string;
  status: VerificationStatus;
}