type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    let formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (meta) {
      formattedMessage += '\n' + JSON.stringify(meta, null, 2);
    }
    
    return formattedMessage;
  }

  private log(level: LogLevel, message: string, meta?: any) {
    if (!this.isDevelopment && level === 'debug') return;

    const formattedMessage = this.formatMessage(level, message, meta);
    
    switch (level) {
      case 'debug':
        console.debug(formattedMessage);
        break;
      case 'info':
        console.info(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'error':
        console.error(formattedMessage);
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

export class APILogger {
  static logRequest(method: string, url: string, body?: any) {
    const logger = Logger.getInstance();
    logger.info(`API Request - ${method} ${url}`);
    if (body && Object.keys(body).length > 0) {
      logger.debug('Request Body:', body);
    }
  }

  static logResponse(method: string, url: string, status: number, body?: any) {
    const logger = Logger.getInstance();
    logger.info(`API Response - ${method} ${url} - Status: ${status}`);
    if (body) {
      logger.debug('Response Body:', body);
    }
  }

  static logError(method: string, url: string, error: any) {
    const logger = Logger.getInstance();
    logger.error(`API Error - ${method} ${url}`, {
      error: error.message,
      stack: error.stack,
    });
  }
}

const logger = Logger.getInstance();
export default logger;