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
import {
  getUserById as getUserByIdFromDB,
  getUsers as getUsersFromDB,
  addUser as addUserToDB,
  updateUserPass as updateUserFromDB,
  deleteUser as deleteUserFromDB,
} from 'src/database/db';
import { CreateUserDto, UpdatePasswordDto } from 'src/utils/requestBodies';

@Controller('user')
export class UserController {
  @Get()
  async getUser(@Res() response: Response) {
    const users = await getUsersFromDB();
    response.status(200).json(users).send();
  }

  @Get(':id')
  async getUserById(@Param() params: any, @Res() response: Response) {
    try {
      const user = await getUserByIdFromDB(params.id);
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
      const newUser = await addUserToDB(body);
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
      const record = await updateUserFromDB(params.id, body);
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
      await deleteUserFromDB(params.id);
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
