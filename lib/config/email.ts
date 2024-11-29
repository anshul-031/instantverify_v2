import { z } from 'zod';

// Basic email configuration schema
const emailConfigSchema = z.object({
  smtp: z.object({
    host: z.string().min(1, "SMTP host is required"),
    port: z.number().int().positive("SMTP port must be a positive number"),
    secure: z.boolean().default(false),
    auth: z.object({
      user: z.string().optional(),
      pass: z.string().optional(),
    }),
  }),
  from: z.string().email("Must be a valid email address"),
  appUrl: z.string().url("Must be a valid URL"),
  isDev: z.boolean().default(false),
});

export type EmailConfig = z.infer<typeof emailConfigSchema>;

// Default development configuration
const devConfig: EmailConfig = {
  smtp: {
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: '',
      pass: '',
    },
  },
  from: 'dev@instantverify.in',
  appUrl: 'http://localhost:3000',
  isDev: true,
};

// Production configuration from environment variables
const prodConfig: EmailConfig = {
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  from: process.env.SMTP_FROM || 'noreply@instantverify.in',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  isDev: process.env.NODE_ENV === 'development',
};

export const emailConfig = process.env.NODE_ENV === 'development' ? devConfig : prodConfig;

export function getEmailConfig(): EmailConfig {
  const config = emailConfig;
  try {
    return emailConfigSchema.parse(config);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using development email configuration due to validation error:', error);
      return devConfig;
    }
    throw error;
  }
}

export function isSmtpConfigured(): boolean {
  try {
    const config = getEmailConfig();
    return !!(config.smtp.auth.user && config.smtp.auth.pass);
  } catch {
    return false;
  }
}