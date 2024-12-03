import { IsInt, IsString, IsDate, IsBoolean } from 'class-validator';

export class CreateSaleTicketDto {
  @IsInt()
  idAirlines: number;

  @IsInt()
  idFlight: number;

  @IsDate()
  dateBuying: Date;

  @IsInt()
  price: number;

  @IsString()
  class: string;

  @IsBoolean()
  luggageAvailable: boolean;
}
