import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metric.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  async getMetrics() {
    return this.metricsService.getMetrics();
  }
}
