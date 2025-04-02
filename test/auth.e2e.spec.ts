import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/authService/auth.controller';
import { AuthService } from '../src/authService/auth.service';
import { ClientProxy } from '@nestjs/microservices';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { CreateUserDto as RegistrationDto } from '../src/authService/dto/create-user-dto';
import { LoginDto } from '../src/authService/dto/login-user-dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let clientProxy: ClientProxy;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getAllUsers: jest.fn(),
          },
        },
        {
          provide: 'AUTH_SERVICE',
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    authService = moduleFixture.get<AuthService>(AuthService);
    clientProxy = moduleFixture.get<ClientProxy>('AUTH_SERVICE');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a user successfully', async () => {
    const registrationDto: RegistrationDto = {
      firstName: 'random',
      secondName: 'random',
      login: 'testuser',
      password: 'password123',
      passportId: '1234567890',
      country: 'Testland',
      email: 'test@example.com',
      telephone: '1234567890',
    };

    jest
      .spyOn(clientProxy, 'send')
      .mockReturnValue(of({ user: registrationDto }));

    const response = await request(app.getHttpServer())
      .post('/auth/registration')
      .send(registrationDto)
      .expect(201);

    expect(response.body).toHaveProperty('login', registrationDto.login);
  });

  it('should not register a user with an existing login', async () => {
    const registrationDto: RegistrationDto = {
      firstName: 'random',
      secondName: 'random',
      login: 'testuser',
      password: 'password123',
      passportId: '1234567890',
      country: 'Testland',
      email: 'test@example.com',
      telephone: '1234567890',
    };

    jest
      .spyOn(clientProxy, 'send')
      .mockReturnValue(of({ error: 'User with this login already exists.' }));

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
    const loginDto: LoginDto = {
      login: 'testuser',
      password: 'password123',
    };

    jest
      .spyOn(clientProxy, 'send')
      .mockReturnValue(
        of({ user: { login: 'testuser' }, token: 'fake-jwt-token' }),
      );

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200);
  });

  it('should not log in with invalid password', async () => {
    const loginDto: LoginDto = {
      login: 'testuser',
      password: 'wrongpassword',
    };

    jest
      .spyOn(clientProxy, 'send')
      .mockReturnValue(of({ error: 'Invalid login credentials.' }));

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
    const loginDto: LoginDto = {
      login: 'nonexistinguser',
      password: 'password123',
    };

    jest
      .spyOn(clientProxy, 'send')
      .mockReturnValue(of({ error: 'User not found' }));

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(400);

    expect(response.body).toHaveProperty('message', 'User not found');
  });
});
