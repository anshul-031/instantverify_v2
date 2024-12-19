import { z } from 'zod';

export const s3ConfigSchema = z.object({
  region: z.string().min(1, "AWS region is required"),
  credentials: z.object({
    accessKeyId: z.string().min(1, "AWS access key ID is required"),
    secretAccessKey: z.string().min(1, "AWS secret access key is required"),
  }),
  bucket: z.string().min(1, "S3 bucket name is required"),
  cloudfrontUrl: z.string().url("CloudFront URL must be a valid URL").optional(),
});

export type S3Config = z.infer<typeof s3ConfigSchema>;

console.log("process.env.AWS_ACCESS_KEY_ID", process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID);
console.log("process.env.AWS_SECRET_ACCESS_KEY", process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY);
export const s3Config: S3Config = {
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  },
  bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || '',
  cloudfrontUrl: process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL,
};

export function validateS3Config(): { isValid: boolean; errors?: string[] } {
  try {
    s3ConfigSchema.parse(s3Config);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { isValid: false, errors };
    }
    return { isValid: false, errors: ['Invalid S3 configuration'] };
  }
}