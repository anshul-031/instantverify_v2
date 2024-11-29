import nodemailer from 'nodemailer';
import { getEmailConfig } from '@/lib/config/email';
import { 
  getVerificationEmailTemplate, 
  getWelcomeEmailTemplate, 
  getPasswordResetEmailTemplate 
} from './email/templates';
import { logger } from './email/logger';

class EmailService {
  private transporter: nodemailer.Transporter;
  private config = getEmailConfig();

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: this.config.smtp.host,
      port: this.config.smtp.port,
      secure: this.config.smtp.secure,
      auth: this.config.smtp.auth,
      debug: this.config.isDev,
    });
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
    } catch (error) {
      logger.error('SMTP Connection Error:', error);
      throw new Error('Failed to connect to SMTP server');
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    try {
      await this.verifyConnection();
      const verificationUrl = `${this.config.appUrl}/verify-email?token=${token}`;
      const template = getVerificationEmailTemplate(email, verificationUrl);
      
      await this.transporter.sendMail({
        from: this.config.from,
        to: email,
        subject: template.subject,
        html: template.html,
      });
    } catch (error) {
      logger.error('Failed to send verification email:', error);
      throw new Error('Failed to send verification email. Please try again later.');
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      await this.verifyConnection();
      const template = getWelcomeEmailTemplate(name);
      
      await this.transporter.sendMail({
        from: this.config.from,
        to: email,
        subject: template.subject,
        html: template.html,
      });
    } catch (error) {
      logger.error('Failed to send welcome email:', error);
      throw new Error('Failed to send welcome email. Please try again later.');
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    try {
      await this.verifyConnection();
      const resetUrl = `${this.config.appUrl}/reset-password/confirm?token=${token}`;
      const template = getPasswordResetEmailTemplate(email, resetUrl);
      
      await this.transporter.sendMail({
        from: this.config.from,
        to: email,
        subject: template.subject,
        html: template.html,
      });
    } catch (error) {
      logger.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email. Please try again later.');
    }
  }
}

export const emailService = new EmailService();