// backend/src/middleware/morganMiddleware.ts

import morgan, { StreamOptions } from 'morgan';
import logger from '../config/logger';

// Define a stream that directs morgan logs to winston
const stream: StreamOptions = {
  write: (message: string) => logger.info(message.trim()),
};

// Custom token to log request duration
morgan.token('duration', (req: any, res) => {
  const start = req['_startTime'] || Date.now();
  const duration = Date.now() - start;
  return `${duration}ms`;
});

// Define morgan format string
const format = ':method :url :status :res[content-length] - :response-time ms :duration';

// Create morgan middleware
const morganMiddleware = morgan(format, { stream });

export default morganMiddleware;
