import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RabbitmqModule } from 'src/rabbitMQ/rabbitmq.module';

@Module({
  imports: [RabbitmqModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
