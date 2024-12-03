import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { resMiddlware } from './middleware/resHeaders.middleware';
import { AuthModule } from './authService/auth.module';
import { FlightModule } from './flightService/flight.module';
import { BookingModule } from './bookingService/booking.module';
import { TransactionModule } from './paymentService/payment.module';
import { RabbitmqModule } from './rabbitMQ/rabbitmq.module';

@Module({
  imports: [
    AuthModule,
    FlightModule,
    BookingModule,
    TransactionModule,
    RabbitmqModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(resMiddlware).forRoutes('*');
  }
}
