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
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { CustomPrometheusModule } from './prometeus/prometeus.module';
@Module({
  imports: [
    AuthModule,
    FlightModule,
    BookingModule,
    TransactionModule,
    CustomPrometheusModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TransactionService,
    AuthService,
    BookingService,
    FlightsService,
    LoggerService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(resMiddlware).forRoutes('*');
  }
}
