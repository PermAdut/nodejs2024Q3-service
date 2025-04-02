import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { User } from 'src/models/auth.model';
import { CreateUserDto as RegistrationDto } from './dto/create-user-dto';
import { LoginDto } from './dto/login-user-dto';
import { compare, genSalt, hash } from 'bcrypt';
import { Payload } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  private prisma = new PrismaClient();

  async getAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany({});
  }

  async registrationUser(
    @Payload() registrationDto: RegistrationDto,
  ): Promise<Omit<User, 'password' | 'registrationSeal'>> {
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
      role: registrationDto.role || 'user',
    };

    const createdUser = await this.prisma.user.create({ data: newUser });
    const { password, registrationSeal, ...userWithoutPassword } = createdUser;
    return userWithoutPassword;
  }

  async loginUser(@Payload() loginDto: LoginDto) {
    const isValidLogin = this.validateLogin(loginDto.login);
    if (!isValidLogin) {
      throw new UnauthorizedException('Invalid login');
    }

    const user = await this.prisma.user.findUnique({
      where: { login: loginDto.login },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isMatchPassword = await compare(loginDto.password, user.password);
    if (!isMatchPassword) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload = { login: user.login, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const { password, registrationSeal, role, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token: accessToken };
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
