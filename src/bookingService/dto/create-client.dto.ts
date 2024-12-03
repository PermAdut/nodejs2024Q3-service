import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateClientDto {
  @IsString()
  firstName: string;

  @IsString()
  secondName: string;

  @IsOptional()
  @IsString()
  thirdName?: string;

  @IsString()
  passportId: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  telephone?: string;
}
