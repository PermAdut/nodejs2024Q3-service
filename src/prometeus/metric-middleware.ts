import { Injectable, NestMiddleware } from '@nestjs/common';
import { MetricsService } from './metric.service';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private readonly metricsService: MetricsService) {}

  use(req: any, res: any, next: () => void) {
    res.on('finish', () => {
      this.metricsService.incRequestCounter(
        req.method,
        req.originalUrl,
        res.statusCode.toString(),
      );
    });
    next();
  }
}
