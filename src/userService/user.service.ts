import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import User, { UserInput } from 'src/models/user.model';
import { CreateUserDto, UpdatePasswordDto } from 'src/utils/requestBodies';
import { v4 } from 'uuid';
import { isUUID } from 'class-validator';
import { compare, genSalt, hash } from 'bcrypt';
import { config } from 'dotenv';
config();
const SALTVAL: string = process.env.CRYPT_SALT;
let SALT;
(async () => {
  SALT = await genSalt(parseInt(SALTVAL));
})();

Injectable();
export class UserService {
  private prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  public async createUser(
    user: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    if (!user.login || !user.password) {
      throw new Error('body does not contain required fields');
    }
    const id = v4();
    const newUser: UserInput = {
      id: id,
      login: user.login,
      password: await hash(user.password, SALT),
      version: 1,
    };
    await this.prisma.user.create({ data: newUser });
    const addedUser = await this.prisma.user.findUnique({ where: { id } });
    const responseAns: Omit<User, 'password'> = {
      id: addedUser.id,
      login: addedUser.login,
      version: addedUser.version,
      createdAt: addedUser.createdAt.getMilliseconds(),
      updatedAt: addedUser.updatedAt.getMilliseconds(),
    };
    return responseAns;
  }

  public async getUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  public async getUserById(id: string): Promise<User> {
    const isMatch = isUUID(id, 4);
    if (!isMatch) {
      throw new Error('Invalid uuid');
    }
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (user) {
      return user;
    } else {
      throw new Error('User not found');
    }
  }

  public async updateUser(
    id: string,
    data: UpdatePasswordDto,
  ): Promise<Omit<User, 'password'>> {
    if (!data.newPassword || !data.oldPassword) {
      throw new Error('Invalid body');
    }
    const isMatch = isUUID(id, 4);
    if (!isMatch) {
      throw new Error('Invalid uuid');
    }
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    const isMatchPass = await compare(data.oldPassword, user.password);
    if (!isMatchPass) {
      throw new Error('Invalid password');
    }
    //const timestamp = new Date();
    const newPass = await hash(data.newPassword, SALT);
    user.password = newPass;
    const upUser = await this.prisma.user.update({
      where: { id },
      data: { password: newPass, version: ++user.version },
    });
    const record: Omit<User, 'password'> = {
      id: upUser.id,
      login: upUser.login,
      version: upUser.version,
      createdAt: upUser.createdAt.getMilliseconds(),
      updatedAt: upUser.updatedAt.getMilliseconds(),
    };
    return record;
  }

  public async deleteUser(id: string): Promise<User> {
    const isMatch = isUUID(id, 4);
    if (!isMatch) {
      throw new Error('Invalid uuid');
    }
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    await this.prisma.user.delete({ where: { id } });
    return user;
  }
}
