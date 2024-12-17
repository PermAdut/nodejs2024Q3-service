import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  login: string;

  @ApiProperty()
  @IsString()
  password: string;

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
  @IsString()
  country: string;

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

  @ApiProperty()
  @IsEnum(Role)
  role?: string;
}
