import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
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

  const microserviceApp = await NestFactory.create(AppModule);
  const microserviceConfig = new DocumentBuilder()
    .setTitle(`${queueName} API`)
    .setDescription(`API documentation for ${queueName}`)
    .setVersion('1.0')
    .build();

  const microserviceDocument = SwaggerModule.createDocument(
    microserviceApp,
    microserviceConfig,
  );
  SwaggerModule.setup(
    `api/docs/${queueName}`,
    microserviceApp,
    microserviceDocument,
  );

  await microservice.listen();
  console.log(`${queueName} Microservice is listening for RabbitMQ messages`);

  await microserviceApp.listen(process.env.MICROSERVICE_PORT || 4001);
  console.log(
    `HTTP Microservice for ${queueName} listening on port ${
      process.env.MICROSERVICE_PORT || 4001
    }`,
  );
}

async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(app.get(ThrottlerGuard));
  const config = new DocumentBuilder()
    .setTitle('Main API')
    .setDescription('Main API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(PORT);
  console.log(`HTTP App listening on port ${PORT}`);

  const queueName = process.argv[2] || null;
  if (queueName) {
    await createMicroservice(queueName);
  }
}

bootstrap();
