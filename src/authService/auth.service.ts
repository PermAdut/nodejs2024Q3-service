import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoginDto, RegistrationDto, User } from 'src/models/auth.model';
import { compare, genSalt, hash } from 'bcrypt';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  private prisma = new PrismaClient();

  async getAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany({});
  }

  @MessagePattern('auth.registration')
  async registrationUser(
    @Payload() registrationDto: RegistrationDto,
  ): Promise<Omit<User, 'password'>> {
    const isValidLogin = this.validateLogin(registrationDto.login);
    if (!isValidLogin) {
      throw new BadRequestException('Invalid login');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { login: registrationDto.login },
    });
    if (existingUser) {
      throw new ConflictException('User with this login already exists.');
    }

    const salt = await genSalt(parseInt(process.env.CRYPT_SALT, 10) || 10);
    const hashedPassword = await hash(registrationDto.password, salt);

    const newUser = {
      login: registrationDto.login,
      password: hashedPassword,
      passportId: registrationDto.passportId,
      registrationSeal: parseInt(process.env.CRYPT_SALT, 10) || 10,
      country: registrationDto.country,
      email: registrationDto.email,
      telephone: registrationDto.telephone,
    };

    const createdUser = await this.prisma.user.create({ data: newUser });
    const { password, ...userWithoutPassword } = createdUser;
    return userWithoutPassword;
  }

  @MessagePattern('auth.login')
  async loginUser(
    @Payload() loginDto: LoginDto,
  ): Promise<Omit<User, 'password' | 'registrationSeal'>> {
    const isValidLogin = this.validateLogin(loginDto.login);
    if (!isValidLogin) {
      throw new BadRequestException('Invalid login');
    }

    const user = await this.prisma.user.findUnique({
      where: { login: loginDto.login },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatchPassword = await compare(loginDto.password, user.password);
    if (!isMatchPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    const { password, registrationSeal, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private validateLogin(login: string): boolean {
    const minLength = 5;
    const maxLength = 20;
    const regex = /^[a-zA-Z0-9_]+$/;
    return (
      login.length >= minLength &&
      login.length <= maxLength &&
      regex.test(login)
    );
  }
}
