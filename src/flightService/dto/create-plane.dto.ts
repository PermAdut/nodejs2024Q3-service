import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreatePlaneDto {
  @ApiProperty()
  @IsString()
  planeType: string;

  @ApiProperty()
  @IsInt()
  planeSeats: number;

  @ApiProperty()
  @IsInt()
  luggageCapacity: number;
}
