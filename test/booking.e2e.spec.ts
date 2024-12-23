import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from '../src/bookingService/booking.service';
import { FlightsService } from '../src/flightService/flight.service';
import { PrismaClient } from '@prisma/client';
import { CreateFlightDto } from '../src/flightService/dto/create-flight.dto';
import { CreatePlaneDto } from '../src/flightService/dto/create-plane.dto';
import { CreateAirlineDto } from '../src/flightService/dto/create-airline.dto';
import { CreateSaleTicketDto } from '../src/bookingService/dto/create-sale-ticket.dto';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('BookingService', () => {
  let bookingService: BookingService;
  let prisma: PrismaClient;
  let flightService: FlightsService;
  let app: INestApplication;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingService, FlightsService],
    }).compile();

    bookingService = module.get<BookingService>(BookingService);
    flightService = module.get<FlightsService>(FlightsService);
    prisma = new PrismaClient();
    app = module.createNestApplication();
    await prisma.sale_tickets.deleteMany({});
    await prisma.flight.deleteMany({});
    await prisma.plane.deleteMany({});
    await prisma.airlines.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });
  describe('findFlightsByDepartureDate', () => {
    it('should create a flight successfully', async () => {
      const plane = {
        planeType: 'Boeing 747',
        planeSeats: 200,
        luggageCapacity: 1000,
      };

      const createdPlane = await flightService.createPlane(
        plane as CreatePlaneDto,
      );

      const flight: CreateFlightDto = {
        flightNum: '14',
        dateFlight: new Date('2023-10-01T12:00:00.000Z'),
        departure: 'Minsk',
        arrival: 'Brest',
        numberOfSeats: 100,
        idPlane: createdPlane.idPlane,
      };

      await flightService.createFlight(flight);
      const response = await request(app.getHttpServer())
        .get(`/booking/depature-date/2023-10-01`)
        .send()
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return error message for no flights found', async () => {
      const date = new Date('2023-10-11');

      jest.spyOn(prisma.flight, 'findMany').mockResolvedValueOnce([]);

      const result = await bookingService.findFlightsByDepartureDate(date);
      expect(result).toEqual({
        error: 'No flights found for the given departure date',
      });
    });
  });

  describe('findFlightsByAirline', () => {
    it('should return flights for valid airline', async () => {
      const createAirlineDto: CreateAirlineDto = {
        airlineName: 'Sky_Airlines',
        contacts: 'support@skyairlines.com',
        telephone: '+1-800-555-0199',
      };

      const airline = await flightService.createAirline(createAirlineDto);

      const plane = {
        planeType: 'Boeing 747',
        planeSeats: 200,
        luggageCapacity: 1000,
      };

      const crPlane = await flightService.createPlane(plane);

      const flight: CreateFlightDto = {
        flightNum: '14',
        dateFlight: new Date('2023-10-01'),
        departure: 'Minsk',
        arrival: 'Brest',
        numberOfSeats: 100,
        idPlane: crPlane.idPlane,
      };

      const newFlight = await flightService.createFlight(flight);

      const createSaleTicketDto: CreateSaleTicketDto = {
        idAirlines: airline.idAirlines,
        idFlight: newFlight.idFlight,
        dateBuying: new Date(),
        price: 1500,
        class: 'Economy',
        luggageAvailable: true,
      };

      const saleTicket = await bookingService.createSaleTicket(
        createSaleTicketDto,
      );

      const mockAirline = {
        idAirlines: airline.idAirlines,
        airlineName: airline.airlineName,
      };

      const mockFlights = [
        { idFlight: newFlight.idFlight, flightNum: newFlight.flightNum },
      ];

      // Мокаем зависимости
      jest
        .spyOn(prisma.airlines, 'findFirst')
        .mockResolvedValueOnce(mockAirline as any);
      jest
        .spyOn(prisma.sale_tickets, 'findMany')
        .mockResolvedValueOnce(mockFlights as any);

      const response = await request(app.getHttpServer())
        .get(`/booking/airline/Sky_Airlines`)
        .send()
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return error message for airline not found', async () => {
      const airlineName = 'UnknownAirline';

      const result = await bookingService.findFlightsByAirline(airlineName);
      expect(result).toEqual({ error: 'Airline not found' });
    });
  });

  describe('findFlightsByDepartureLocation', () => {
    it('should return flights for valid departure location', async () => {
      const plane = {
        planeType: 'Boeing 747',
        planeSeats: 200,
        luggageCapacity: 1000,
      };

      const createdPlane = await flightService.createPlane(
        plane as CreatePlaneDto,
      );

      const flight: CreateFlightDto = {
        flightNum: '14',
        dateFlight: new Date('2023-10-01T12:00:00.000Z'),
        departure: 'Minsk',
        arrival: 'Brest',
        numberOfSeats: 100,
        idPlane: createdPlane.idPlane,
      };

      await flightService.createFlight(flight);
      const mockFlights = [flight];

      const response = await request(app.getHttpServer())
        .get(`/booking/departure/${flight.departure}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return error message for no flights found at departure location', async () => {
      const departure = 'UnknownLocation';

      const response = await request(app.getHttpServer())
        .get(`/booking/departure/${departure}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('findFlightsByArrivalLocation', () => {
    it('should return flights for valid arrival location', async () => {
      const plane = {
        planeType: 'Boeing 747',
        planeSeats: 200,
        luggageCapacity: 1000,
      };

      const createdPlane = await flightService.createPlane(
        plane as CreatePlaneDto,
      );

      const flight: CreateFlightDto = {
        flightNum: '14',
        dateFlight: new Date('2024-12-20T10:57:03.590Z'),
        departure: 'Minsk',
        arrival: 'Brest',
        numberOfSeats: 100,
        idPlane: createdPlane.idPlane,
      };

      await flightService.createFlight(flight);
      const mockFlights = [flight];

      const response = await request(app.getHttpServer())
        .get(`/booking/arrival/${flight.arrival}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return error message for no flights found at arrival location', async () => {
      const arrival = 'UnknownLocation';

      const response = await request(app.getHttpServer())
        .get(`/booking/arrival/${arrival}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
