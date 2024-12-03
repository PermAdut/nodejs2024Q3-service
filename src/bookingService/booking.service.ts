import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateSaleTicketDto } from './dto/create-sale-ticket.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Injectable()
export class BookingService {
  private prisma = new PrismaClient();

  @MessagePattern('booking.create')
  async createBooking(@Payload() createBookingDto: CreateBookingDto) {
    try {
      const booking = await this.prisma.booking_service.create({
        data: createBookingDto,
      });
      return booking;
    } catch (error) {
      throw new ConflictException('Error creating booking');
    }
  }

  @MessagePattern('client.create')
  async createClient(@Payload() createClientDto: CreateClientDto) {
    try {
      const client = await this.prisma.clients.create({
        data: createClientDto,
      });
      return client;
    } catch (error) {
      throw new ConflictException('Error creating client');
    }
  }

  @MessagePattern('saleTicket.create')
  async createSaleTicket(@Payload() createSaleTicketDto: CreateSaleTicketDto) {
    try {
      const saleTicket = await this.prisma.sale_tickets.create({
        data: createSaleTicketDto,
      });
      return saleTicket;
    } catch (error) {
      throw new ConflictException('Error creating sale ticket');
    }
  }

  @MessagePattern('booking.update')
  async updateBooking(
    @Payload()
    {
      idBooking,
      updateBookingDto,
    }: {
      idBooking: number;
      updateBookingDto: CreateBookingDto;
    },
  ) {
    try {
      const booking = await this.prisma.booking_service.update({
        where: { idBooking },
        data: updateBookingDto,
      });
      return booking;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Booking not found');
      }
      throw new ConflictException('Error updating booking');
    }
  }

  @MessagePattern('booking.delete')
  async deleteBooking(@Payload() idBooking: number) {
    try {
      await this.prisma.booking_service.delete({
        where: { idBooking },
      });
      return { message: 'Booking deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Booking not found');
      }
      throw new ConflictException('Error deleting booking');
    }
  }

  @MessagePattern('bookings.getAll')
  async getAllBookings() {
    return await this.prisma.booking_service.findMany();
  }

  @MessagePattern('booking.getById')
  async getBookingById(@Payload() idBooking: number) {
    const booking = await this.prisma.booking_service.findUnique({
      where: { idBooking },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }
}
