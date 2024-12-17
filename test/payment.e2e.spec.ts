import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../src/paymentService/payment.controller';
import { TransactionService } from '../src/paymentService/payment.service';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ClientProxy } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';

describe('TransactionController (e2e)', () => {
  let app: INestApplication;
  let transactionService: TransactionService;
  let clientProxy: ClientProxy;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: {
            processTransaction: jest.fn(),
          },
        },
        {
          provide: 'PAYMENT_SERVICE',
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    transactionService =
      moduleFixture.get<TransactionService>(TransactionService);
    clientProxy = moduleFixture.get<ClientProxy>('PAYMENT_SERVICE');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should process a transaction successfully', async () => {
    const createTransactionDto = {
      transactionId: 'tx-123',
      amount: 100,
      description: '14',
      date: '2023-10-01T12:00:00Z',
    };

    jest.spyOn(clientProxy, 'send').mockReturnValue(
      of({
        message: 'Transaction processed successfully',
        transactionId: createTransactionDto.transactionId,
      }),
    );

    const response = await request(app.getHttpServer())
      .post('/transactions/process')
      .send(createTransactionDto)
      .expect(201);

    expect(response.body).toHaveProperty(
      'message',
      'Transaction processed successfully',
    );
    expect(response.body).toHaveProperty(
      'transactionId',
      createTransactionDto.transactionId,
    );
  });

  it('should return an error if transaction processing fails', async () => {
    const createTransactionDto = {
      transactionId: 'tx-123',
      amount: 100,
      description: '14',
    };

    jest
      .spyOn(clientProxy, 'send')
      .mockReturnValue(of({ message: 'Error processing transaction' }));

    const response = await request(app.getHttpServer())
      .post('/transactions/process')
      .send(createTransactionDto)
      .expect(409);
  });

  it('should return health status', async () => {
    const response = await request(app.getHttpServer())
      .get('/transactions/health')
      .expect(200);

    expect(response.body).toHaveProperty(
      'message',
      'Payment service works correctly',
    );
  });
});
