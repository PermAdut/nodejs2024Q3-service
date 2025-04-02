import {
  Controller,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionService } from './paymentService/payment.service';
import { CreateTransactionDto } from './paymentService/dto/create-transaction.dto';
import { AuthService } from './authService/auth.service';
import { LoginDto } from './authService/dto/login-user-dto';
import { CreateUserDto as RegistrationDto } from './authService/dto/create-user-dto';
import { BookingService } from './bookingService/booking.service';
import { LoggerService } from './utils/logger.service';
import { BuyTicketDto } from './bookingService/dto/buy_titcket-dto';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly paymentService: TransactionService,
    private readonly authService: AuthService,
    private readonly bookingService: BookingService,
    private readonly logger: LoggerService,
  ) {}

  @MessagePattern('registration')
  async handleRegistration(@Payload() body: RegistrationDto) {
    try {
      if (body.role === 'admin') {
        this.logger.log(`Admin registration attempt: ${body.email}`);
      }
      const user = await this.authService.registrationUser(body);
      this.logger.log(`User registered: ${user.email}`);
      const { login, password, role, country, ...unreleasedBody } = body;
      await this.bookingService.createClient(unreleasedBody);
      return { user };
    } catch (err) {
      this.logger.error(`Registration error: ${err.message}`);
      if (err instanceof ConflictException) {
        return { error: 'User with this login already exists.' };
      } else if (err instanceof BadRequestException) {
        return { error: err.message || 'Invalid registration data.' };
      } else {
        return { error: 'An unexpected error occurred during registration.' };
      }
    }
  }

  @MessagePattern('login')
  async handleLogin(@Payload() body: LoginDto) {
    try {
      const user = await this.authService.loginUser(body);
      this.logger.log(`User login: ${user.user.login}`);
      return { user };
    } catch (err) {
      this.logger.log(`Login error: ${err.message}`);
      if (err instanceof UnauthorizedException) {
        return { error: 'Invalid login credentials.' };
      } else if (err instanceof BadRequestException) {
        return { error: err.message || 'Invalid login data.' };
      } else {
        return { error: 'An unexpected error occurred during login.' };
      }
    }
  }

  @MessagePattern('transaction.process')
  async hadnle(data: CreateTransactionDto) {
    try {
      this.logger.log(`Proccesing transaction ${data.transactionId}`);
      return await this.paymentService.processTransaction(data);
    } catch (error) {
      return {
        message: 'Error processing transaction',
      };
    }
  }

  @MessagePattern('flights.findByDepartureDate')
  async findFlightByDepDate(date: Date) {
    try {
      const result = this.bookingService.findFlightsByDepartureDate(date);
      this.logger.log(`Searching department by date: ${result}`);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new ConflictException(
        'Error while finding flights by departure date',
      );
    }
  }

  @MessagePattern('flights.findByAirline')
  async findFlightsByAirline(airlineName: string) {
    try {
      const result = await this.bookingService.findFlightsByAirline(
        airlineName,
      );
      this.logger.log(`Searching department by airline: ${result}`);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new ConflictException('Error while finding flights by airline');
    }
  }

  @MessagePattern('flights.findByDepartureLocation')
  async findFlightsByDepartureLocation(departure: string) {
    try {
      const result = await this.bookingService.findFlightsByDepartureLocation(
        departure,
      );
      this.logger.log(`Searching department by dep: ${result}`);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new ConflictException(
        'Error while finding flights by departure location',
      );
    }
  }

  @MessagePattern('flights.findByArrivalLocation')
  async findFlightsByArrivalLocation(arrival: string) {
    try {
      const result = await this.bookingService.findFlightsByArrivalLocation(
        arrival,
      );
      this.logger.log(`Searching department by arrival: ${result}`);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new ConflictException(
        'Error while finding flights by arrival location',
      );
    }
  }

  @MessagePattern('bookTicket')
  async bookTicker(@Body() createTicketDto: BuyTicketDto) {
    try {
      this.logger.log('Booking a ticket...');
      const book = await this.bookingService.bookSeat(createTicketDto);
      return book;
    } catch (err) {
      return {
        error: 'Error booking ticket',
      };
    }
  }
}
