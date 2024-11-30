import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'defaultSecret';
const TOKEN_EXPIRE_TIME = process.env.TOKEN_EXPIRE_TIME || '1h';

export const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET_KEY, {
    expiresIn: TOKEN_EXPIRE_TIME,
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET_KEY);
};
