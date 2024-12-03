import { IsString, IsInt, IsDate } from 'class-validator';

export class CreateFlightDto {
  @IsString()
  flightNum: string;

  @IsDate()
  dateFlight: Date;

  @IsString()
  departure: string;

  @IsString()
  arrival: string;

  @IsInt()
  numberOfSeats: number;

  @IsInt()
  idPlane: number;
}
