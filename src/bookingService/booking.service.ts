import { Injectable } from '@nestjs/common';
import { Airlines, Flight, Plane, PrismaClient } from '@prisma/client';

@Injectable()
export class BookingService {
  private prisma = new PrismaClient();

  async addFlight(body: Flight) {
    const flight = await this.prisma.flight.findUnique({
      where: { idFlight: body.idFlight },
    });
    if (!flight) {
      return await this.prisma.flight.create({ data: body });
    } else {
      throw new Error('This flight already exist');
    }
  }

  async deleteFlight(id: number) {
    return await this.prisma.flight.delete({ where: { idFlight: id } });
  }

  async addPlane(body: Plane) {
    const plane = await this.prisma.plane.findUnique({
      where: { idPlane: body.idPlane },
    });
    if (!plane) {
      return await this.prisma.plane.create({ data: body });
    } else {
      throw new Error('This flight already exist');
    }
  }

  async deletePlane(id: number) {
    return await this.prisma.plane.delete({ where: { idPlane: id } });
  }

  async addAirlines(airline: Airlines) {
    const airlines = await this.prisma.airlines.findUnique({
      where: { idAirlines: airline.idAirlines },
    });
    if (!airlines) {
      return await this.prisma.airlines.create({ data: airline });
    } else {
      throw new Error('This flight already exist');
    }
  }

  async deleteAirlines(id: number) {
    return await this.prisma.airlines.delete({ where: { idAirlines: id } });
  }
}
