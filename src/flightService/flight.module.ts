import { Module } from '@nestjs/common';
import { FlightsService } from './flight.service';
import { FlightsController } from './flight.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { config } from 'dotenv';
config();
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FLIGHTS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQS], // Change this to your RabbitMQ URL
          queue: 'flights_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [FlightsController],
  providers: [FlightsService],
})
export class FlightModule {}
