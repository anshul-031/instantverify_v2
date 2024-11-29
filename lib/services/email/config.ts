import { z } from 'zod';

export const emailConfigSchema = z.object({
  smtp: z.object({
    host: z.string().min(1, "SMTP host is required"),
    port: z.number().int().positive("SMTP port must be a positive number"),
    secure: z.boolean().default(false),
    auth: z.object({
      user: z.string().min(1, "SMTP username is required"),
      pass: z.string().min(1, "SMTP password is required")
    }),
    timeout: z.number().int().positive().default(60000), // 60 seconds
    retries: z.number().int().min(0).max(3).default(3),
    poolSize: z.number().int().min(1).max(10).default(5),
    rateLimitPerHour: z.number().int().positive().default(100)
  }),
  from: z.string().email("Must be a valid email address"),
  appUrl: z.string().url("Must be a valid URL")
});

export type EmailConfig = z.infer<typeof emailConfigSchema>;

export const emailConfig: EmailConfig = {
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '587',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
    timeout: 60000,
    retries: 3,
    poolSize: 5,
    rateLimitPerHour: 100
  },
  from: process.env.SMTP_FROM || 'ceo@instantverify.in',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
};

export function validateEmailConfig(): { isValid: boolean; errors?: string[] } {
  try {
    emailConfigSchema.parse(emailConfig);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { isValid: false, errors };
    }
    return { isValid: false, errors: ['Invalid email configuration'] };
  }
}