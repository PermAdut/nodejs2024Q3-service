import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { resMiddlware } from './middleware/resHeaders.middleware';
import { AuthModule } from './authService/auth.module';
import { FlightModule } from './flightService/flight.module';
import { BookingModule } from './bookingService/booking.module';
import { TransactionModule } from './paymentService/payment.module';
import { TransactionService } from './paymentService/payment.service';
import { AuthService } from './authService/auth.service';
import { BookingService } from './bookingService/booking.service';
import { FlightsService } from './flightService/flight.service';
import { LoggerService } from './utils/logger.service';
import { CustomPrometheusModule } from './prometeus/prometeus.module';
import { MetricsMiddleware } from './prometeus/metric-middleware';
import { MetricsService } from './prometeus/metric.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
@Module({
  imports: [
    AuthModule,
    FlightModule,
    BookingModule,
    TransactionModule,
    CustomPrometheusModule,
    ThrottlerModule.forRoot({
      limit: 10,
      ttl: 60,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TransactionService,
    AuthService,
    BookingService,
    FlightsService,
    LoggerService,
    MetricsService,
    ThrottlerGuard,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(resMiddlware).forRoutes('*');
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
