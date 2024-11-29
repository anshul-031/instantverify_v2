import { TransportOptions } from 'nodemailer';

export interface EmailTemplate {
  subject: string;
  html: string;
}

export interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  headers?: Record<string, string>;
}

export interface SmtpConfig extends TransportOptions {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user?: string;
    pass?: string;
  };
  tls?: {
    rejectUnauthorized: boolean;
    minVersion: string;
  };
}

export interface EmailProvider {
  getSmtpConfig(): SmtpConfig;
  validateConfig(): Promise<boolean>;
  formatEmailOptions(options: EmailOptions): EmailOptions;
}

export interface EmailService {
  sendVerificationEmail(email: string, token: string): Promise<void>;
  sendWelcomeEmail(email: string, name: string): Promise<void>;
  sendPasswordResetEmail(email: string, token: string): Promise<void>;
}

export class EmailError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'EmailError';
  }
}