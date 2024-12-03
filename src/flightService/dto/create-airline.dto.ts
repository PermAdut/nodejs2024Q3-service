import { IsString } from 'class-validator';

export class CreateAirlineDto {
  @IsString()
  airlineName: string;

  @IsString()
  contacts: string;

  @IsString()
  telephone: string;
}
