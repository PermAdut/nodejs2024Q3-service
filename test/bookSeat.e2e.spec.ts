import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from '../src/bookingService/booking.controller';
import { BookingService } from '../src/bookingService/booking.service';
import { ClientProxy } from '@nestjs/microservices';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { of } from 'rxjs';
import { BuyTicketDto } from '../src/bookingService/dto/buy_titcket-dto';

describe('BookingController (e2e)', () => {
  let app: INestApplication;
  let bookingService: BookingService;
  let clientProxy: ClientProxy;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        {
          provide: BookingService,
          useValue: {
            bookSeat: jest.fn(),
          },
        },
        {
          provide: 'BOOKING_SERVICE',
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    bookingService = moduleFixture.get<BookingService>(BookingService);
    clientProxy = moduleFixture.get<ClientProxy>('BOOKING_SERVICE');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should book a seat successfully', async () => {
    const buyTicketDto: BuyTicketDto = {
      flightId: 1,
      clientId: 1,
      quantity: 1,
    };

    // Мокаем ответ от клиентского прокси
    jest.spyOn(clientProxy, 'send').mockReturnValue(
      of({
        message: 'Booked flight TestDeparture to TestArrival',
      }),
    );

    const response = await request(app.getHttpServer())
      .post('/booking/book-seat')
      .send(buyTicketDto)
      .expect(201);

    expect(response.body).toHaveProperty(
      'message',
      'Booked flight TestDeparture to TestArrival',
    );
  });

  it('should return an error if booking fails', async () => {
    const buyTicketDto: BuyTicketDto = {
      flightId: 1,
      clientId: 1,
      quantity: 1,
    };

    // Мокаем ошибку от клиентского прокси
    jest.spyOn(clientProxy, 'send').mockReturnValue(
      of({
        error: 'Error booking ticket',
      }),
    );

    const response = await request(app.getHttpServer())
      .post('/booking/book-seat')
      .send(buyTicketDto)
      .expect(409);

    expect(response.body).toHaveProperty('message', 'Error booking ticket');
  });
});
