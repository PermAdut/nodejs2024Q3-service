import { Injectable } from '@nestjs/common';
import { Counter, register } from 'prom-client';

@Injectable()
export class MetricsService {
  private httpRequestCounter: Counter<string>;

  constructor() {
    this.httpRequestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status'],
    });
  }

  public incRequestCounter(method: string, route: string, status: string) {
    this.httpRequestCounter.labels(method, route, status).inc();
  }

  public getMetrics() {
    return register.metrics();
  }
}
