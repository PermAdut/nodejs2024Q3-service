import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateFlightDto } from './dto/create-flight.dto';
import { CreatePlaneDto } from './dto/create-plane.dto';
import { CreateAirlineDto } from './dto/create-airline.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Injectable()
export class FlightsService {
  private prisma = new PrismaClient();

  @MessagePattern('flight.create')
  async createFlight(@Payload() createFlightDto: CreateFlightDto) {
    try {
      const flight = await this.prisma.flight.create({
        data: createFlightDto,
      });
      return flight;
    } catch (error) {
      throw new ConflictException('Error creating flight');
    }
  }

  @MessagePattern('flight.update')
  async updateFlight(
    @Payload()
    {
      idFlight,
      updateFlightDto,
    }: {
      idFlight: number;
      updateFlightDto: CreateFlightDto;
    },
  ) {
    try {
      const flight = await this.prisma.flight.update({
        where: { idFlight },
        data: updateFlightDto,
      });
      return flight;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Flight not found');
      }
      throw new ConflictException('Error updating flight');
    }
  }

  @MessagePattern('flight.delete')
  async deleteFlight(@Payload() idFlight: number) {
    try {
      await this.prisma.flight.delete({
        where: { idFlight },
      });
      return { message: 'Flight deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Flight not found');
      }
      throw new ConflictException('Error deleting flight');
    }
  }

  @MessagePattern('plane.create')
  async createPlane(@Payload() createPlaneDto: CreatePlaneDto) {
    try {
      const plane = await this.prisma.plane.create({
        data: createPlaneDto,
      });
      return plane;
    } catch (error) {
      throw new ConflictException('Error creating plane');
    }
  }

  @MessagePattern('plane.update')
  async updatePlane(
    @Payload()
    {
      idPlane,
      updatePlaneDto,
    }: {
      idPlane: number;
      updatePlaneDto: CreatePlaneDto;
    },
  ) {
    try {
      const plane = await this.prisma.plane.update({
        where: { idPlane },
        data: updatePlaneDto,
      });
      return plane;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Plane not found');
      }
      throw new ConflictException('Error updating plane');
    }
  }

  @MessagePattern('plane.delete')
  async deletePlane(@Payload() idPlane: number) {
    try {
      await this.prisma.plane.delete({
        where: { idPlane },
      });
      return { message: 'Plane deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Plane not found');
      }
      throw new ConflictException('Error deleting plane');
    }
  }

  @MessagePattern('airline.create')
  async createAirline(@Payload() createAirlineDto: CreateAirlineDto) {
    try {
      const airline = await this.prisma.airlines.create({
        data: createAirlineDto,
      });
      return airline;
    } catch (error) {
      throw new ConflictException('Error creating airline');
    }
  }

  @MessagePattern('airline.update')
  async updateAirline(
    @Payload()
    {
      idAirlines,
      updateAirlineDto,
    }: {
      idAirlines: number;
      updateAirlineDto: CreateAirlineDto;
    },
  ) {
    try {
      const airline = await this.prisma.airlines.update({
        where: { idAirlines },
        data: updateAirlineDto,
      });
      return airline;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Airline not found');
      }
      throw new ConflictException('Error updating airline');
    }
  }

  @MessagePattern('airline.delete')
  async deleteAirline(@Payload() idAirlines: number) {
    try {
      await this.prisma.airlines.delete({
        where: { idAirlines },
      });
      return { message: 'Airline deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Airline not found');
      }
      throw new ConflictException('Error deleting airline');
    }
  }

  @MessagePattern('flights.getAll')
  async getAllFlights() {
    return await this.prisma.flight.findMany();
  }

  @MessagePattern('flight.getById')
  async getFlightById(@Payload() idFlight: number) {
    const flight = await this.prisma.flight.findUnique({
      where: { idFlight },
    });
    if (!flight) {
      throw new NotFoundException('Flight not found');
    }
    return flight;
  }

  @MessagePattern('planes.getAll')
  async getAllPlanes() {
    return await this.prisma.plane.findMany();
  }

  @MessagePattern('plane.getById')
  async getPlaneById(@Payload() idPlane: number) {
    const plane = await this.prisma.plane.findUnique({
      where: { idPlane },
    });
    if (!plane) {
      throw new NotFoundException('Plane not found');
    }
    return plane;
  }

  @MessagePattern('airlines.getAll')
  async getAllAirlines() {
    return await this.prisma.airlines.findMany();
  }

  @MessagePattern('airline.getById')
  async getAirlineById(@Payload() idAirlines: number) {
    const airline = await this.prisma.airlines.findUnique({
      where: { idAirlines },
    });
    if (!airline) {
      throw new NotFoundException('Airline not found');
    }
    return airline;
  }
}
