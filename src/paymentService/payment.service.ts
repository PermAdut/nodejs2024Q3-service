import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  @MessagePattern('transaction.process')
  async processTransaction(
    @Payload() createTransactionDto: CreateTransactionDto,
  ) {
    try {
      this.logger.log(
        `Transaction Processed: ${JSON.stringify(createTransactionDto)}`,
      );

      // Here you can add any additional logic for processing the transaction
      return {
        message: 'Transaction processed successfully',
        transactionId: createTransactionDto.transactionId,
      };
    } catch (error) {
      throw new ConflictException('Error processing transaction');
    }
  }
}
