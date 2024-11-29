import { EmailService, EmailTemplate } from './types';
import { EmailTransport } from './transport';
import { GmailProvider } from './providers/gmail';
import { 
  getVerificationEmailTemplate, 
  getWelcomeEmailTemplate,
  getPasswordResetEmailTemplate 
} from './templates';
import { logger } from './logger';

export class EmailServiceImpl implements EmailService {
  private transport: EmailTransport;
  private fromAddress: string;

  constructor() {
    const provider = new GmailProvider(
      process.env.SMTP_USER || '',
      process.env.SMTP_PASS || ''
    );
    this.transport = new EmailTransport(provider);
    this.fromAddress = process.env.SMTP_FROM || 'noreply@instantverify.in';
  }

  private async sendEmail(template: EmailTemplate, to: string) {
    await this.transport.sendMail({
      from: this.fromAddress,
      to,
      subject: template.subject,
      html: template.html,
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    try {
      const template = getVerificationEmailTemplate(email, token);
      await this.sendEmail(template, email);
      logger.info('Verification email sent successfully', { to: email });
    } catch (error) {
      logger.error('Failed to send verification email:', { error, to: email });
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      const template = getWelcomeEmailTemplate(name);
      await this.sendEmail(template, email);
      logger.info('Welcome email sent successfully', { to: email });
    } catch (error) {
      logger.error('Failed to send welcome email:', { error, to: email });
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    try {
      const template = getPasswordResetEmailTemplate(email, token);
      await this.sendEmail(template, email);
      logger.info('Password reset email sent successfully', { to: email });
    } catch (error) {
      logger.error('Failed to send password reset email:', { error, to: email });
      throw error;
    }
  }
}

export const emailService = new EmailServiceImpl();