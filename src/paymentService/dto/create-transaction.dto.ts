import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty()
  @IsString()
  transactionId: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsDate()
  date: Date;
}
