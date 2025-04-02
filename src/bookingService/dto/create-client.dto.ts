import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateClientDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  secondName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  thirdName?: string;

  @ApiProperty()
  @IsString()
  passportId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  telephone?: string;
}
