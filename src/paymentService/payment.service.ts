import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Payload } from '@nestjs/microservices';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  onModuleInit() {
    this.logger.log(
      'TransactionService initialized and ready to process transactions.',
    );
  }

  async processTransaction(
    @Payload() createTransactionDto: CreateTransactionDto,
  ) {
    this.logger.log(
      `Transaction Processed: ${JSON.stringify(createTransactionDto)}`,
    );
    if (
      createTransactionDto.amount &&
      createTransactionDto.date &&
      createTransactionDto.transactionId
    ) {
      return {
        message: 'Transaction processed successfully',
        transactionId: createTransactionDto.transactionId,
      };
    } else {
      this.logger.error('Error processing transaction');
      throw new ConflictException('Error processing transaction');
    }
  }
}
