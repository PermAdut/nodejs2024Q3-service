import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional, IsDate } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty()
  @IsInt()
  idFlight: number;

  @ApiProperty()
  @IsInt()
  idUser: number;

  @ApiProperty()
  @IsDate()
  bookDate: Date;

  @ApiProperty()
  @IsInt()
  status: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  additionalService?: string;
}
