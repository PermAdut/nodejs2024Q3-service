import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto, UpdatePasswordDto } from 'src/utils/requestBodies';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  @Get()
  async getUsers(@Res() response: Response) {
    const users = await this.userService.getUsers();
    response.status(200).json(users).send();
  }

  @Get(':id')
  async getUserById(@Param() params: any, @Res() response: Response) {
    try {
      const user = await this.userService.getUserById(params.id);
      response.status(200).json(user).send();
    } catch (err) {
      if (err.message == 'Invalid uuid') {
        response.status(400).json('Invalid uuid').send();
      } else if (err.message == 'User not found') {
        response.status(404).json('User not found').send();
      }
    }
  }

  @Post()
  async addUser(@Req() request: Request, @Res() response: Response) {
    try {
      const body = request.body as unknown as CreateUserDto;
      const newUser = await this.userService.createUser(body);
      response.status(201).json(newUser).send();
    } catch (err) {
      if (err.message === 'body does not contain required fields') {
        return response
          .status(400)
          .json('body does not contain required fields')
          .send();
      }
      response.status(500).send();
    }
  }

  @Put(':id')
  async updateUser(
    @Req() request: Request,
    @Res() response: Response,
    @Param() params: any,
  ) {
    try {
      const body = request.body as unknown as UpdatePasswordDto;
      const record = await this.userService.updateUser(params.id, body);
      response.status(200).json(record).send();
    } catch (err) {
      switch (err.message) {
        case 'Invalid uuid':
          response.status(400).json('Invalid uuid').send();
          break;
        case 'User not found':
          response.status(404).json('User not found').send();
          break;
        case 'Invalid password':
          response.status(403).json('Invalid password').send();
          break;
        default:
          response.status(400).send();
          break;
      }
    }
  }
  @Delete(':id')
  async deleteUser(@Res() response: Response, @Param() params: any) {
    try {
      await this.userService.deleteUser(params.id);
      response.status(204).send();
    } catch (err) {
      if (err.message == 'Invalid uuid') {
        response.status(400).json('Invalid uuid').send();
      } else if (err.message == 'User not found') {
        response.status(404).json('User not found').send();
      }
    }
  }
}
