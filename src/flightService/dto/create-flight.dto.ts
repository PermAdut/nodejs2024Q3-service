import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDate } from 'class-validator';

export class CreateFlightDto {
  @ApiProperty()
  @IsString()
  flightNum: string;

  @ApiProperty()
  @IsDate()
  dateFlight: Date;

  @ApiProperty()
  @IsString()
  departure: string;

  @ApiProperty()
  @IsString()
  arrival: string;

  @ApiProperty()
  @IsInt()
  numberOfSeats: number;

  @ApiProperty()
  @IsInt()
  idPlane: number;
}
