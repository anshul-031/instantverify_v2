import { z } from 'zod';
import { 
  VerificationType, 
  VerificationMethod, 
  SecurityLevel,
  VerificationStatus 
} from '@/lib/types/verification';

// Custom validator for File-like objects
const fileSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
}).passthrough(); // Allow other File properties

const additionalInfoSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  aadhaarNumber: z.string().optional(),
  drivingLicenseNumber: z.string().optional(),
  voterIdNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  otp: z.string().optional(),
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
  securityLevel: z.enum([
    'most-advanced',
    'medium-advanced',
    'less-advanced'
  ] as const),
  documents: z.object({
    governmentId: z.array(z.union([fileSchema, z.string()])).optional(),
  }).optional(),
  additionalInfo: additionalInfoSchema.optional(),
});

export type VerificationSchemaType = z.infer<typeof verificationSchema>;

// Separate schema for API responses where documents are URLs
export const verificationResponseSchema = verificationSchema.extend({
  id: z.string(),
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