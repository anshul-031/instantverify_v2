import { EmailService } from './types';
import { getEmailConfig } from '@/lib/config/email';
import { 
  getVerificationEmailTemplate, 
  getWelcomeEmailTemplate, 
  getPasswordResetEmailTemplate 
} from './templates';

export class MockEmailService implements EmailService {
  private config = getEmailConfig();

  private logEmail(to: string, subject: string, html: string) {
    console.log('\n=== Development Email Service ===');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('HTML:', html);
    console.log('=============================\n');
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${this.config.appUrl}/verify-email?token=${token}`;
    const template = getVerificationEmailTemplate(email, verificationUrl);
    this.logEmail(email, template.subject, template.html);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const template = getWelcomeEmailTemplate(name);
    this.logEmail(email, template.subject, template.html);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${this.config.appUrl}/reset-password/confirm?token=${token}`;
    const template = getPasswordResetEmailTemplate(email, resetUrl);
    this.logEmail(email, template.subject, template.html);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}