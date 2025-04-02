import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto as RegistrationDto } from './dto/create-user-dto';
import { LoginDto } from './dto/login-user-dto';
import { JwtAuthGuard } from './jwt.auth.guard';
import { RolesGuard } from './roles-guard';
import { Roles } from './roles-decorator';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('AUTH_SERVICE') private readonly client: ClientProxy,
  ) {}
  @Post('registration')
  async registration(@Body() body: RegistrationDto, @Res() res: Response) {
    try {
      const response = await firstValueFrom(
        this.client.send('registration', body),
      );
      if (response.error) {
        if (response.error === 'User with this login already exists.') {
          return res.status(HttpStatus.CONFLICT).json({
            message: response.error,
          });
        } else {
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: response.error,
          });
        }
      }
      return res.status(HttpStatus.CREATED).json(response.user);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'An unexpected error occurred during registration.',
      });
    }
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    try {
      const response = await firstValueFrom(this.client.send('login', body));

      if (response.error) {
        if (response.error === 'Invalid login credentials.') {
          return res.status(HttpStatus.UNAUTHORIZED).json({
            message: response.error,
          });
        } else {
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: response.error,
          });
        }
      }
      return res.status(HttpStatus.OK).json(response.user);
    } catch (error) {
      console.error('Login error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'An unexpected error occurred during login.',
      });
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('secret')
  @Roles('admin')
  async getUsers() {
    return await this.authService.getAllUsers();
  }

  @Get('health')
  async checkHealth() {
    return {
      message: 'Auth service works correctly',
    };
  }
}
