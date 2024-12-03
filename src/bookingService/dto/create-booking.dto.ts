import { IsInt, IsString, IsOptional, IsDate } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  idFlight: number;

  @IsInt()
  idUser: number;

  @IsDate()
  bookDate: Date;

  @IsInt()
  status: number;

  @IsOptional()
  @IsString()
  additionalService?: string;
}
