import {
  Controller,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Get,
  Inject,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateSaleTicketDto } from './dto/create-sale-ticket.dto';
import { BookingService } from './booking.service';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { BuyTicketDto } from './dto/buy_titcket-dto';
import { Roles } from '../authService/roles-decorator';
import { JwtAuthGuard } from '../authService/jwt.auth.guard';
import { RolesGuard } from '../authService/roles-guard';

@Controller('booking')
export class BookingController {
  constructor(
    @Inject('BOOKING_SERVICE') private readonly client: ClientProxy,
    private readonly bookingService: BookingService,
  ) {}

  @Post('create-booking')
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    return await this.bookingService.createBooking(createBookingDto);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('create-client')
  async createClient(@Body() createClientDto: CreateClientDto) {
    return await this.bookingService.createClient(createClientDto);
  }

  @Post('create-sale-ticket')
  async createSaleTicket(@Body() createSaleTicketDto: CreateSaleTicketDto) {
    return await this.bookingService.createSaleTicket(createSaleTicketDto);
  }

  @Put('update-booking/:id')
  async updateBooking(
    @Param('id') idBooking: number,
    @Body() updateBookingDto: CreateBookingDto,
  ) {
    return await this.bookingService.updateBooking({
      idBooking,
      updateBookingDto,
    });
  }

  @Delete('delete-booking/:id')
  async deleteBooking(@Param('id') idBooking: number) {
    return await this.bookingService.deleteBooking(idBooking);
  }

  @Get('bookings')
  async getAllBookings() {
    return await this.bookingService.getAllBookings();
  }

  @Get('booking/:id')
  async getBookingById(@Param('id') idBooking: number) {
    return await this.bookingService.getBookingById(idBooking);
  }

  @Get('departure-date/:date')
  async findFlightsByDepartureDate(
    @Param('date') date: string,
    @Res() res: Response,
  ) {
    try {
      const flights = await firstValueFrom(
        this.client.send('flights.findByDepartureDate', new Date(date)),
      );
      return res.status(HttpStatus.OK).json(flights);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error while finding flights by departure date',
      });
    }
  }

  @Get('airline/:name')
  async findFlightsByAirline(
    @Param('name') airlineName: string,
    @Res() res: Response,
  ) {
    try {
      const flights = await firstValueFrom(
        this.client.send('flights.findByAirline', airlineName),
      );
      return res.status(HttpStatus.OK).json(flights);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error while finding flights by airline',
      });
    }
  }

  @Get('departure/:location')
  async findFlightsByDepartureLocation(
    @Param('location') departure: string,
    @Res() res: Response,
  ) {
    try {
      console.log(departure);
      const flights = await firstValueFrom(
        this.client.send('flights.findByDepartureLocation', departure),
      );
      return res.status(HttpStatus.OK).json(flights);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error while finding flights by departure location',
      });
    }
  }

  @Get('arrival/:location')
  async findFlightsByArrivalLocation(
    @Param('location') arrival: string,
    @Res() res: Response,
  ) {
    try {
      const flights = await firstValueFrom(
        this.client.send('flights.findByArrivalLocation', arrival),
      );
      return res.status(HttpStatus.OK).json(flights);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error while finding flights by arrival location',
      });
    }
  }

  @Post('book-seat')
  async bookSeat(
    @Body() createSeatBookingDto: BuyTicketDto,
    @Res() res: Response,
  ) {
    const book = await firstValueFrom(
      this.client.send('bookTicket', createSeatBookingDto),
    );
    if (book.error) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ message: 'Error booking ticket' });
    }
    return res.status(HttpStatus.CREATED).json(book);
  }

  @Get('health')
  async checkHealth() {
    return {
      message: 'Booking service works correctly',
    };
  }
}
