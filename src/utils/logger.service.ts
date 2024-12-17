import { Injectable } from '@nestjs/common';
import { logger } from './logger';

@Injectable()
export class LoggerService {
  log(message: string) {
    logger.info(message);
  }

  error(message: string) {
    logger.error(message);
  }

  warn(message: string) {
    logger.warn(message);
  }
}
