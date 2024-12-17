import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateSaleTicketDto } from './dto/create-sale-ticket.dto';
import { Payload } from '@nestjs/microservices';
import { BuyTicketDto } from './dto/buy_titcket-dto';

@Injectable()
export class BookingService {
  private prisma = new PrismaClient();

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

  async getAllBookings() {
    return await this.prisma.booking_service.findMany();
  }

  async getBookingById(@Payload() idBooking: number) {
    const booking = await this.prisma.booking_service.findUnique({
      where: { idBooking },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async findFlightsByDepartureDate(departureDate: Date) {
    const flights = await this.prisma.flight.findMany({
      where: {
        dateFlight: departureDate,
      },
    });

    if (flights.length === 0) {
      return { error: 'No flights found for the given departure date' };
    }

    return flights;
  }

  async findFlightsByAirline(airlineName: string) {
    const airline = await this.prisma.airlines.findFirst({
      where: {
        airlineName: airlineName,
      },
    });

    if (!airline) {
      return { error: 'Airline not found' };
    }

    const flights = await this.prisma.sale_tickets.findMany({
      where: {
        idAirlines: airline.idAirlines,
      },
      include: {
        flight: true,
      },
    });

    if (flights.length === 0) {
      return { error: 'No flights found for the given airline' };
    }

    return flights;
  }

  async findFlightsByDepartureLocation(departure: string) {
    const flights = await this.prisma.flight.findMany({
      where: {
        departure: departure,
      },
    });
    if (flights.length === 0) {
      return { error: 'No flights found for the given departure location' };
    }

    return flights;
  }

  async findFlightsByArrivalLocation(arrival: string) {
    const flights = await this.prisma.flight.findMany({
      where: {
        arrival: arrival,
      },
    });

    if (flights.length === 0) {
      return { error: 'No flights found for the given arrival location' };
    }

    return flights;
  }

  async bookSeat(createSeatBookingDto: BuyTicketDto) {
    const { flightId, clientId, quantity } = createSeatBookingDto;
    try {
      const flight = await this.prisma.flight.findUnique({
        where: { idFlight: flightId },
      });
      console.log(flight);
      return {
        message: `Booked flight ${flight.departure} to ${flight.arrival}`,
      };
    } catch (err) {
      throw new ConflictException('Error booking the seat');
    }
  }
}
