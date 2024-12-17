import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

config();

async function bootstrap() {
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQS],
        queue: 'auth_queue',
        queueOptions: {
          durable: true,
        },
      },
    });

  await microservice.listen();
  console.log('Auth Microservice is listening for RabbitMQ messages');
}

bootstrap();
