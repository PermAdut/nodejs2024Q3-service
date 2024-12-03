import { Module } from '@nestjs/common';
import { TransactionController } from './payment.controller';
import { TransactionService } from './payment.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
