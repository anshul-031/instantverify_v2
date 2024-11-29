type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export class EmailLogger {
  private static instance: EmailLogger;
  
  private constructor() {}
  
  static getInstance(): EmailLogger {
    if (!EmailLogger.instance) {
      EmailLogger.instance = new EmailLogger();
    }
    return EmailLogger.instance;
  }

  private log(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    switch (level) {
      case 'debug':
        if (process.env.NODE_ENV === 'development') {
          console.debug(logMessage, meta);
        }
        break;
      case 'info':
        console.info(logMessage, meta);
        break;
      case 'warn':
        console.warn(logMessage, meta);
        break;
      case 'error':
        console.error(logMessage, meta);
        break;
    }
  }

  debug(message: string, meta?: any) {
    this.log('debug', message, meta);
  }

  info(message: string, meta?: any) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: any) {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: any) {
    this.log('error', message, meta);
  }
}

export const logger = EmailLogger.getInstance();