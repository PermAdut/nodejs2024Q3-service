import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAirlineDto {
  @ApiProperty()
  @IsString()
  airlineName: string;

  @ApiProperty()
  @IsString()
  contacts: string;

  @ApiProperty()
  @IsString()
  telephone: string;
}
