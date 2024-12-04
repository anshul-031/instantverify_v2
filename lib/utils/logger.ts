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
    new transports.Console(),
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

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