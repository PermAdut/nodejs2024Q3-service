import { Controller, Post, Body, Res, Get, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { RegistrationDto, LoginDto } from 'src/models/auth.model';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('AUTH_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post('registration')
  async registration(@Body() body: RegistrationDto, @Res() res: Response) {
    try {
      const user = await this.client
        .send('auth.registration', body)
        .toPromise();
      return res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    try {
      const user = await this.client.send('auth.login', body).toPromise();
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: error.message });
    }
  }

  @Get('secret')
  async getUsers() {
    return await this.authService.getAllUsers();
  }
}
