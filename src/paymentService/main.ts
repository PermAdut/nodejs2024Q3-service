import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TransactionModule } from './payment.module';

config();

async function bootstrap() {
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      TransactionModule,
      {
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQS],
          queue: 'payment_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    );

  await microservice.listen();
  console.log('Payment Microservice is listening for RabbitMQ messages');
}

bootstrap();
