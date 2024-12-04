import { createLogger, format, transports } from 'winston';

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Create logger with only console transport for cloud environments
const logger = createLogger({
  levels: logLevels,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.colorize({ all: true }),
    format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ],
});

// Add file transports only if in development and file system is accessible
if (process.env.NODE_ENV === 'development') {
  try {
    logger.add(new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      handleExceptions: true,
    }));
    logger.add(new transports.File({
      filename: 'logs/combined.log',
      handleExceptions: true,
    }));
  } catch (error) {
    logger.warn('Unable to create log files, falling back to console only logging');
  }
}

export class APILogger {
  static logRequest(method: string, url: string, body?: any) {
    logger.info(`API Request - ${method} ${url}`);
    if (body && Object.keys(body).length > 0) {
      logger.debug('Request Body:', body);
    }
  }

  static logResponse(method: string, url: string, status: number, body?: any) {
    logger.info(`API Response - ${method} ${url} - Status: ${status}`);
    if (body) {
      logger.debug('Response Body:', body);
    }
  }

  static logError(method: string, url: string, error: any) {
    logger.error(`API Error - ${method} ${url}`, {
      error: error.message,
      stack: error.stack,
    });
  }
}

export default logger;