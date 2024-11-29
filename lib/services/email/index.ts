import { EmailService } from './types';
import { MockEmailService } from './mock-email';
import { EmailServiceImpl } from './service';
import { isSmtpConfigured } from '@/lib/config/email';

let emailServiceInstance: EmailService | null = null;

export function getEmailService(): EmailService {
  if (!emailServiceInstance) {
    if (!isSmtpConfigured()) {
      console.log('Using mock email service - SMTP not configured');
      emailServiceInstance = new MockEmailService();
    } else {
      emailServiceInstance = new EmailServiceImpl();
    }
  }
  
  return emailServiceInstance;
}

export const emailService = getEmailService();