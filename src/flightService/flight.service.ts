import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateFlightDto } from './dto/create-flight.dto';
import { CreatePlaneDto } from './dto/create-plane.dto';
import { CreateAirlineDto } from './dto/create-airline.dto';

@Injectable()
export class FlightsService {
  private prisma = new PrismaClient();

  async createFlight(createFlightDto: CreateFlightDto) {
    try {
      const flight = await this.prisma.flight.create({
        data: createFlightDto,
      });
      return flight;
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async updateFlight(idFlight: number, updateFlightDto: CreateFlightDto) {
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

  async deleteFlight(idFlight: number) {
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

  async createPlane(createPlaneDto: CreatePlaneDto) {
    try {
      const plane = await this.prisma.plane.create({
        data: createPlaneDto,
      });
      return plane;
    } catch (error) {
      throw new ConflictException('Error creating plane');
    }
  }

  async updatePlane(idPlane: number, updatePlaneDto: CreatePlaneDto) {
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

  async deletePlane(idPlane: number) {
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

  async createAirline(createAirlineDto: CreateAirlineDto) {
    try {
      const airline = await this.prisma.airlines.create({
        data: createAirlineDto,
      });
      return airline;
    } catch (error) {
      throw new ConflictException('Error creating airline');
    }
  }

  async updateAirline(idAirlines: number, updateAirlineDto: CreateAirlineDto) {
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

  async deleteAirline(idAirlines: number) {
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

  async getAllFlights() {
    return await this.prisma.flight.findMany();
  }

  async getFlightById(idFlight: number) {
    const flightId =
      typeof idFlight === 'string' ? parseInt(idFlight, 10) : idFlight;
    const flight = await this.prisma.flight.findUnique({
      where: { idFlight: flightId },
    });
    if (!flight) {
      throw new NotFoundException('Flight not found');
    }
    return flight;
  }

  async getAllPlanes() {
    return await this.prisma.plane.findMany();
  }

  async getPlaneById(idPlane: number) {
    const plane = await this.prisma.plane.findUnique({
      where: { idPlane },
    });
    if (!plane) {
      throw new NotFoundException('Plane not found');
    }
    return plane;
  }

  async getAllAirlines() {
    return await this.prisma.airlines.findMany();
  }

  async getAirlineById(idAirlines: number) {
    const airline = await this.prisma.airlines.findUnique({
      where: { idAirlines },
    });
    if (!airline) {
      throw new NotFoundException('Airline not found');
    }
    return airline;
  }
}
