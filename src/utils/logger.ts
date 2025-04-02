import { createLogger, format, transports } from 'winston';
import * as path from 'path';
import * as fs from 'fs';
const logDirectory = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

export const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(logDirectory, 'error.log'),
      level: 'error',
    }),
    new transports.File({ filename: path.join(logDirectory, 'combined.log') }),
  ],
});
