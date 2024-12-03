import { IsString, IsNumber, IsDate } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  transactionId: string;

  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsDate()
  date: Date;
}
