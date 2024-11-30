import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoginDto, RegistrationDto, User } from 'src/models/auth.model';
import { compare, genSalt, hash } from 'bcrypt';
import { config } from 'dotenv';
import { generateToken } from 'src/jwtTokenEntity/jwt.entity';
config();
const SALTVAL: string = process.env.CRYPT_SALT;
let SALT;
(async () => {
  SALT = await genSalt(parseInt(SALTVAL));
})();

@Injectable()
export class AuthService {
  private prisma = new PrismaClient();

  async registrationUser(
    registrationDto: RegistrationDto,
  ): Promise<Omit<User, 'password'>> {
    const isValidLogin = await this.validateLogin(registrationDto.login);
    if (!isValidLogin) {
      throw new Error('Invalid login');
    }
    const isExistUser = await this.prisma.user.findUnique({
      where: { login: registrationDto.login },
    });
    if (isExistUser) {
      throw new Error('User with this login already exists.');
    }
    const newUser: User = {
      login: registrationDto.login,
      password: await hash(registrationDto.password, SALT),
      passportId: registrationDto.passportId,
      registrationSeal: SALT,
      country: registrationDto.country,
      email: registrationDto?.email,
      telephone: registrationDto?.telephone,
    };
    const createdUser = await this.prisma.user.create({ data: newUser });
    const { password, ...userWithoutPassword } = createdUser;
    return userWithoutPassword;
  }

  async loginUser(loginDto: LoginDto): Promise<Omit<User, 'password'>> {
    const isValidLogin = await this.validateLogin(loginDto.login);
    if (!isValidLogin) {
      throw new Error('Invalid login');
    }
    const user = await this.prisma.user.findUnique({
      where: { login: loginDto.login },
    });
    if (!user) {
      throw new Error('User not created');
    }
    const SALT = user.registrationSeal;
    const userPass = await hash(loginDto.password, SALT);
    const isMatchPassword = await compare(userPass, user.password);
    if (!isMatchPassword) {
      throw new Error('Invalid password');
    }
    const { password, ...userWithoutPassword } = user;
    const token = generateToken(user.idUser.toString());
    return userWithoutPassword;
  }

  private async validateLogin(login: string): Promise<boolean> {
    const minLenght = 5;
    const maxLenght = 20;
    if (login.length < minLenght || login.length > maxLenght) {
      return false;
    }
    const regex = /^[a-zA-Z0-9_]+$/;
    return regex.test(login);
  }
}
