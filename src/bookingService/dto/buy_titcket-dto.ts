import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BuyTicketDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  flightId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  clientId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
