import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { verifyToken } from 'src/jwtTokenEntity/jwt.entity';
@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const decoded = verifyToken(token);
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
