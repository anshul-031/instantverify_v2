import { z } from 'zod';

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

const config: EmailConfig = {
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  from: process.env.SMTP_FROM || '',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || '',
  isDev: process.env.NODE_ENV === 'development',
};

export function getEmailConfig(): EmailConfig {
  try {
    return emailConfigSchema.parse(config);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Email configuration validation error:', error);
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