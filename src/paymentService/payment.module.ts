import { Module } from '@nestjs/common';
import { TransactionController } from './payment.controller';
import { TransactionService } from './payment.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { config } from 'dotenv';
config();
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQS],
          queue: 'payment_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
