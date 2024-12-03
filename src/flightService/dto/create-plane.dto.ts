import { IsString, IsInt } from 'class-validator';

export class CreatePlaneDto {
  @IsString()
  planeType: string;

  @IsInt()
  planeSeats: number;

  @IsInt()
  luggageCapacity: number;
}
