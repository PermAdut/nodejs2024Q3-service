import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsDate, IsBoolean } from 'class-validator';

export class CreateSaleTicketDto {
  @ApiProperty()
  @IsInt()
  idAirlines: number;

  @ApiProperty()
  @IsInt()
  idFlight: number;

  @ApiProperty()
  @IsDate()
  dateBuying: Date;

  @ApiProperty()
  @IsInt()
  price: number;

  @ApiProperty()
  @IsString()
  class: string;

  @ApiProperty()
  @IsBoolean()
  luggageAvailable: boolean;
}
