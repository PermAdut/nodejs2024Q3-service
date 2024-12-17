import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
config();

async function createMicroservice(queueName: string) {
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQS],
        queue: queueName,
        queueOptions: {
          durable: true,
        },
      },
    });

  await microservice.listen();
  console.log(`${queueName} Microservice is listening for RabbitMQ messages`);
}

async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(PORT);
  console.log(`HTTP App listening on port ${PORT}`);

  const queues = ['payment_queue', 'flights_queue', 'booking_queue'];
  for (const queue of queues) {
    await createMicroservice(queue);
  }
}

bootstrap();
