import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { config } from 'dotenv';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
config();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQS],
          queue: 'auth_queue',
          queueOptions: {
            durable: true,
          },
          noAck: false,
        },
      },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY || 'your_jwt_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    { provide: PrismaClient, useValue: new PrismaClient() },
  ],
})
export class AuthModule {}
