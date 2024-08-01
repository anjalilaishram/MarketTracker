// backend/src/config/logger.ts

import winston from 'winston';

const { combine, timestamp, printf } = winston.format;

// Define your log format
const logFormat = printf(({ level, message, timestamp, duration }) => {
  return `${timestamp} [${level}] ${message} ${duration ? `Duration: ${duration}ms` : ''}`;
});

// Create a Winston logger instance
const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(), // Log to console
  ],
});

export default logger;
