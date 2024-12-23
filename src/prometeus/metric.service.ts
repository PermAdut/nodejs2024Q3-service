import { Injectable } from '@nestjs/common';
import { Counter, register } from 'prom-client';

@Injectable()
export class MetricsService {
  private static initialized = false;
  private httpRequestCounter: Counter<string>;

  constructor() {
    if (!MetricsService.initialized) {
      this.httpRequestCounter = new Counter({
        name: 'http_requests_total',
        help: 'Total number of HTTP requests',
        labelNames: ['method', 'route', 'status'],
      });
      MetricsService.initialized = true;
    }
  }

  public incRequestCounter(method: string, route: string, status: string) {
    this.httpRequestCounter.labels(method, route, status).inc();
  }

  public getMetrics() {
    return register.metrics();
  }
}
