import { Controller, Post, Body, Inject } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ClientProxy } from '@nestjs/microservices';
@Controller('transactions')
export class TransactionController {
  constructor(
    @Inject('PAYMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post('process')
  async processTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return await this.client
      .send('transaction.process', createTransactionDto)
      .toPromise();
  }
}
