import nodemailer from 'nodemailer';
import { logger } from './logger';

export class SmtpConnectionPool {
  private static instance: SmtpConnectionPool;
  private pool: nodemailer.Transporter[];
  private maxConnections: number;
  private currentIndex: number;

  private constructor(maxConnections: number = 5) {
    this.pool = [];
    this.maxConnections = maxConnections;
    this.currentIndex = 0;
  }

  static getInstance(): SmtpConnectionPool {
    if (!SmtpConnectionPool.instance) {
      SmtpConnectionPool.instance = new SmtpConnectionPool();
    }
    return SmtpConnectionPool.instance;
  }

  createTransporter(config: any): nodemailer.Transporter {
    return nodemailer.createTransport({
      ...config,
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 5,
    });
  }

  async getTransporter(config: any): Promise<nodemailer.Transporter> {
    if (this.pool.length < this.maxConnections) {
      const transporter = this.createTransporter(config);
      this.pool.push(transporter);
      logger.debug('Created new SMTP connection', { poolSize: this.pool.length });
      return transporter;
    }

    this.currentIndex = (this.currentIndex + 1) % this.pool.length;
    return this.pool[this.currentIndex];
  }

  async closeAll(): Promise<void> {
    await Promise.all(this.pool.map(transporter => transporter.close()));
    this.pool = [];
    this.currentIndex = 0;
    logger.info('Closed all SMTP connections');
  }
}