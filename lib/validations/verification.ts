import { z } from 'zod';
import { 
  VerificationType, 
  VerificationMethod, 
  SecurityLevel,
  VerificationStatus 
} from '@/lib/types/verification';

const documentInfoSchema = z.object({
  url: z.string(),
  type: z.string(),
  name: z.string(),
  size: z.number(),
});

const documentsSchema = z.object({
  governmentId: z.array(documentInfoSchema).optional(),
  personPhoto: z.array(documentInfoSchema).optional(),
});

export const verificationSchema = z.object({
  type: z.enum(['tenant', 'maid', 'driver', 'matrimonial', 'other'] as const),
  method: z.enum([
    'aadhaar-otp',
    'advanced-aadhaar',
    'advanced-driving-license',
    'advanced-voter-id',
    'advanced-passport',
    'driving-license-aadhaar',
    'voter-id-aadhaar',
    'basic-driving-license',
    'basic-voter-id',
    'basic-passport',
    'driving-license',
    'voter-id'
  ] as const),
  documents: documentsSchema,
  purpose: z.string().optional().nullable(),
  userId: z.string(),
  aadhaarNumber: z.string().optional().nullable(),
  verificationMethod: z.string().optional(), // For internal use
});

export type VerificationSchemaType = z.infer<typeof verificationSchema>;