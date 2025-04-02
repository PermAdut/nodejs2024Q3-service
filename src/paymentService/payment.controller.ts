import {
  Controller,
  Post,
  Body,
  Inject,
  Get,
  HttpCode,
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { firstValueFrom } from 'rxjs';
import { Response } from 'express';
@Controller('transactions')
export class TransactionController {
  constructor(
    @Inject('PAYMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post('process')
  async processTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
    @Res() res: Response,
  ) {
    const response = await firstValueFrom(
      this.client.send('transaction.process', createTransactionDto),
    );
    if (response.message == 'Error processing transaction') {
      return res.status(409).json({ message: 'Error processing transaction' });
    }
    return res.json(response);
  }
  @Get('health')
  async checkHealth() {
    return {
      message: 'Payment service works correctly',
    };
  }
}
