import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../src/authService/auth.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaClient } from '@prisma/client';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = new PrismaClient();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  it('should register a user successfully', async () => {
    const registrationDto = {
      login: 'testuser',
      password: 'password123',
      passportId: '1234567890',
      country: 'Testland',
      email: 'test@example.com',
      telephone: '1234567890',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/registration')
      .send(registrationDto)
      .expect(201);

    expect(response.body).toHaveProperty('login', registrationDto.login);
    expect(response.body).not.toHaveProperty('password');
  });

  it('should not register a user with an existing login', async () => {
    const registrationDto = {
      login: 'testuser',
      password: 'password123',
      passportId: '1234567890',
      country: 'Testland',
      email: 'test@example.com',
      telephone: '1234567890',
    };

    await request(app.getHttpServer())
      .post('/auth/registration')
      .send(registrationDto)
      .expect(201);

    // Попробуем зарегистрировать того же пользователя снова
    const response = await request(app.getHttpServer())
      .post('/auth/registration')
      .send(registrationDto)
      .expect(409);

    expect(response.body).toHaveProperty(
      'message',
      'User with this login already exists.',
    );
  });

  it('should log in a user successfully', async () => {
    const registrationDto = {
      login: 'testuser',
      password: 'password123',
      passportId: '1234567890',
      country: 'Testland',
      email: 'test@example.com',
      telephone: '1234567890',
    };

    await request(app.getHttpServer())
      .post('/auth/registration')
      .send(registrationDto)
      .expect(201);

    const loginDto = {
      login: 'testuser',
      password: 'password123',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200);
  });

  it('should not log in with invalid password', async () => {
    const registrationDto = {
      login: 'testuser',
      password: 'password123',
      passportId: '1234567890',
      country: 'Testland',
      email: 'test@example.com',
      telephone: '1234567890',
    };

    // Сначала зарегистрируем пользователя
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send(registrationDto)
      .expect(201);

    const loginDto = {
      login: 'testuser',
      password: 'wrongpassword',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(401);

    expect(response.body).toHaveProperty(
      'message',
      'Invalid login credentials.',
    );
  });

  it('should not log in with non-existing user', async () => {
    const loginDto = {
      login: 'nonexistinguser',
      password: 'password123',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(400);

    expect(response.body).toHaveProperty('message', 'User not found');
  });
});
