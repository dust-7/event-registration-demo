import { createLogger, format, transports } from 'winston';

export const myTransports = {
  console: new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple(),
    ),
  }),
  general: new transports.File({ filename: 'logs/requests.log' }),
  error: new transports.File({ filename: 'logs/error.log', level: 'error' }),
};

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    myTransports.console,
    myTransports.general,
    myTransports.error,
  ],
});
