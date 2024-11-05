import { Controller, Get } from '@nestjs/common';
import User from 'src/models/user.model';

@Controller()
export class UserController {
  @Get('/user')
  getUser(): User[] {
    return [];
  }
}
