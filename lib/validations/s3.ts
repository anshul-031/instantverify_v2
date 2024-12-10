import { z } from 'zod';
import { s3Config } from '@/lib/config/s3';

const s3ValidationSchema = z.object({
  region: z.string().min(1, "AWS region is required"),
  credentials: z.object({
    accessKeyId: z.string().min(1, "AWS access key ID is required"),
    secretAccessKey: z.string().min(1, "AWS secret access key is required"),
  }),
  bucket: z.string().min(1, "S3 bucket name is required"),
  cloudfrontUrl: z.string().url("CloudFront URL must be a valid URL").optional(),
});

export function validateS3Config(): { isValid: boolean; errors?: string[] } {
  try {
    s3ValidationSchema.parse(s3Config);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { isValid: false, errors };
    }
    return { isValid: false, errors: ['Invalid S3 configuration'] };
  }
}