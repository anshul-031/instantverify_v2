import { EmailProvider, EmailOptions, SmtpConfig } from '../types';
import { logger } from '../logger';

export class GmailProvider implements EmailProvider {
  private config: {
    user: string;
    pass: string;
  };

  constructor(user: string, pass: string) {
    this.config = { user, pass };
  }

  getSmtpConfig(): SmtpConfig {
    return {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.config.user,
        pass: this.config.pass,
      },
      tls: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2',
      },
    };
  }

  async validateConfig(): Promise<boolean> {
    if (!this.config.user || !this.config.pass) {
      logger.error('Gmail provider configuration is incomplete');
      return false;
    }
    return true;
  }

  formatEmailOptions(options: EmailOptions): EmailOptions {
    return {
      ...options,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'X-Mailer': 'InstantVerify Mailer',
        ...options.headers,
      },
    };
  }
}