import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { config } from 'dotenv';
config();
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'BOOKING_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQS],
          queue: 'booking_queue',
          queueOptions: {
            durable: true,
          },
          noAck: false,
        },
      },
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
