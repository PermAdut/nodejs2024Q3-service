import {
  Controller,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Get,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateSaleTicketDto } from './dto/create-sale-ticket.dto';

@Controller('booking')
export class BookingController {
  constructor(
    @Inject('BOOKING_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post('create-booking')
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    return await this.client
      .send('booking.create', createBookingDto)
      .toPromise();
  }

  @Post('create-client')
  async createClient(@Body() createClientDto: CreateClientDto) {
    return await this.client.send('client.create', createClientDto).toPromise();
  }

  @Post('create-sale-ticket')
  async createSaleTicket(@Body() createSaleTicketDto: CreateSaleTicketDto) {
    return await this.client
      .send('saleTicket.create', createSaleTicketDto)
      .toPromise();
  }

  @Put('update-booking/:id')
  async updateBooking(
    @Param('id') idBooking: number,
    @Body() updateBookingDto: CreateBookingDto,
  ) {
    return await this.client
      .send('booking.update', { idBooking, updateBookingDto })
      .toPromise();
  }

  @Delete('delete-booking/:id')
  async deleteBooking(@Param('id') idBooking: number) {
    return await this.client.send('booking.delete', idBooking).toPromise();
  }

  @Get('bookings')
  async getAllBookings() {
    return await this.client.send('bookings.getAll', {}).toPromise();
  }

  @Get('booking/:id')
  async getBookingById(@Param('id') idBooking: number) {
    return await this.client.send('booking.getById', idBooking).toPromise();
  }
}
