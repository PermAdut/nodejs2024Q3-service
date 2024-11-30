import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { RegistrationDto } from 'src/models/auth.model';
import { AuthMiddleWare } from 'src/middleware/jwtTokenMiddleware';
Controller('auth');
export class AuthController {
  private authService: AuthService = new AuthService();

  @Post('registration')
  async registration(req: Request, res: Response) {
    const body = req.body as unknown as RegistrationDto;
    try {
      const user = await this.authService.registrationUser(body);
      res.status(201).json(user).send();
    } catch {
      res.status(404).send();
    }
  }

  @Post('login')
  async login(req: Request, res: Response) {
    const body = req.body as unknown as RegistrationDto;
    try {
      const user = await this.authService.loginUser(body);
      res.status(201).json(user).send();
    } catch {
      res.status(404).send();
    }
  }
}
