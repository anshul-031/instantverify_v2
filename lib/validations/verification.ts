import { z } from 'zod';
import { 
  VerificationType, 
  VerificationMethod, 
  SecurityLevel,
  VerificationStatus 
} from '@/lib/types/verification';

// Custom validator for File objects
const fileSchema = z.custom<File>((data) => data instanceof File, {
  message: "Must be a File object"
});

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
    governmentId: z.array(fileSchema).optional(),
    personPhoto: fileSchema.optional(),
  }).optional(),
  additionalInfo: z.object({
    aadhaarNumber: z.string().optional(),
    drivingLicenseNumber: z.string().optional(),
    voterIdNumber: z.string().optional(),
    dateOfBirth: z.string().optional(),
    otp: z.string().optional(),
  }).optional(),
});

export type VerificationSchemaType = z.infer<typeof verificationSchema>;

// Separate schema for API responses where documents are URLs
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
  securityLevel: z.enum(['most-advanced', 'medium-advanced', 'less-advanced'] as const),
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