import nodemailer from 'nodemailer';
import { EmailProvider, EmailOptions, EmailError, SmtpConfig } from './types';
import { logger } from './logger';

export class EmailTransport {
  private transporter: nodemailer.Transporter | null = null;
  private provider: EmailProvider;
  private retryAttempts: number = 3;
  private retryDelay: number = 1000;

  constructor(provider: EmailProvider) {
    this.provider = provider;
  }

  private async createTransporter() {
    if (!this.transporter) {
      const isValid = await this.provider.validateConfig();
      if (!isValid) {
        throw new EmailError(
          'Invalid email provider configuration',
          'INVALID_CONFIG'
        );
      }

      const config = this.provider.getSmtpConfig();
      this.transporter = nodemailer.createTransport(config);
    }
    return this.transporter;
  }

  private async verifyConnection() {
    const transporter = await this.createTransporter();
    try {
      await transporter.verify();
      logger.info('SMTP connection verified successfully');
    } catch (error) {
      logger.error('SMTP connection verification failed:', error);
      throw new EmailError(
        'Failed to connect to SMTP server',
        'CONNECTION_ERROR',
        error as Error
      );
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async sendMail(options: EmailOptions): Promise<void> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        await this.verifyConnection();
        const formattedOptions = this.provider.formatEmailOptions(options);
        const transporter = await this.createTransporter();
        await transporter.sendMail(formattedOptions);
        logger.info('Email sent successfully', { to: options.to });
        return;
      } catch (error) {
        lastError = error as Error;
        logger.error(
          `Email sending attempt ${attempt} failed:`,
          { error, to: options.to }
        );

        if (attempt < this.retryAttempts) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1);
          await this.sleep(delay);
        }
      }
    }

    throw new EmailError(
      'Failed to send email after multiple attempts',
      'SEND_ERROR',
      lastError || undefined
    );
  }
}