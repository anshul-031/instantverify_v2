import { z } from 'zod';
import { 
  VerificationType, 
  VerificationMethod, 
  SecurityLevel 
} from '@/lib/types/verification';

export const verificationSchema = z.object({
  type: z.enum(['tenant', 'maid', 'driver', 'matrimonial', 'other'] as const),
  country: z.string().min(1, 'Country is required'),
  method: z.enum([
    'aadhaar-otp',
    'driving-license-aadhaar',
    'voter-id-aadhaar',
    'driving-license',
    'voter-id'
  ] as const),
  documents: z.object({
    governmentId: z.array(z.string()).optional(),
    personPhoto: z.string().optional(),
  }).optional(),
  additionalInfo: z.object({
    aadhaarNumber: z.string().optional(),
    drivingLicenseNumber: z.string().optional(),
    voterIdNumber: z.string().optional(),
    dateOfBirth: z.string().optional(),
    otp: z.string().optional(),
  }).optional(),
});

export type VerificationFormData = z.infer<typeof verificationSchema>;

export const verificationResponseSchema = z.object({
  id: z.string(),
  type: z.enum(['tenant', 'maid', 'driver', 'matrimonial', 'other'] as const),
  country: z.string(),
  method: z.enum([
    'aadhaar-otp',
    'driving-license-aadhaar',
    'voter-id-aadhaar',
    'driving-license',
    'voter-id'
  ] as const),
  status: z.enum([
    'pending',
    'payment-pending',
    'payment-complete',
    'verified',
    'rejected'
  ] as const),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type VerificationResponse = z.infer<typeof verificationResponseSchema>;