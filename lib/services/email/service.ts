import nodemailer from 'nodemailer';
import { EmailService, EmailTemplate } from './types';
import { getEmailConfig } from '@/lib/config/email';
import { logger } from './logger';
import { 
  getVerificationEmailTemplate, 
  getWelcomeEmailTemplate,
  getPasswordResetEmailTemplate 
} from './templates';

export class EmailServiceImpl implements EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private config = getEmailConfig();
  private retryAttempts = 3;
  private retryDelay = 1000;

  private async createTransporter() {
    if (!this.transporter) {
      if (!this.config.smtp.auth.user || !this.config.smtp.auth.pass) {
        throw new Error('SMTP credentials are not configured');
      }

      this.transporter = nodemailer.createTransport({
        host: this.config.smtp.host,
        port: this.config.smtp.port,
        secure: this.config.smtp.secure,
        auth: {
          user: this.config.smtp.auth.user,
          pass: this.config.smtp.auth.pass,
        },
        debug: this.config.isDev,
      });
    }
    return this.transporter;
  }

  private async verifyConnection() {
    try {
      const transporter = await this.createTransporter();
      await transporter.verify();
      logger.info('SMTP connection verified successfully');
    } catch (error) {
      logger.error('SMTP connection verification failed:', error);
      throw new Error('Failed to connect to SMTP server');
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async sendWithRetry(email: string, template: EmailTemplate): Promise<void> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        await this.verifyConnection();
        const transporter = await this.createTransporter();
        
        await transporter.sendMail({
          from: this.config.from,
          to: email,
          subject: template.subject,
          html: template.html,
        });

        logger.info('Email sent successfully', { to: email });
        return;
      } catch (error) {
        lastError = error as Error;
        logger.error(
          `Email sending attempt ${attempt} failed:`,
          { error, to: email }
        );

        if (attempt < this.retryAttempts) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1);
          await this.sleep(delay);
        }
      }
    }

    throw new Error(
      `Failed to send email after ${this.retryAttempts} attempts: ${lastError?.message}`
    );
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    try {
      const verificationUrl = `${this.config.appUrl}/verify-email?token=${token}`;
      const template = getVerificationEmailTemplate(email, verificationUrl);
      await this.sendWithRetry(email, template);
    } catch (error) {
      logger.error('Failed to send verification email:', { error, to: email });
      throw new Error('Failed to send verification email. Please try again later.');
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      const template = getWelcomeEmailTemplate(name);
      await this.sendWithRetry(email, template);
    } catch (error) {
      logger.error('Failed to send welcome email:', { error, to: email });
      throw new Error('Failed to send welcome email. Please try again later.');
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    try {
      const resetUrl = `${this.config.appUrl}/reset-password/confirm?token=${token}`;
      const template = getPasswordResetEmailTemplate(email, resetUrl);
      await this.sendWithRetry(email, template);
    } catch (error) {
      logger.error('Failed to send password reset email:', { error, to: email });
      throw new Error('Failed to send password reset email. Please try again later.');
    }
  }
}

export const emailService = new EmailServiceImpl();