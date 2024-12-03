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
import { CreateFlightDto } from './dto/create-flight.dto';
import { CreatePlaneDto } from './dto/create-plane.dto';
import { CreateAirlineDto } from './dto/create-airline.dto';
import { ClientProxy } from '@nestjs/microservices';

@Controller('flights')
export class FlightsController {
  constructor(
    @Inject('FLIGHTS_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post('create-flight')
  async createFlight(@Body() createFlightDto: CreateFlightDto) {
    return await this.client.send('flight.create', createFlightDto).toPromise();
  }

  @Put('update-flight/:id')
  async updateFlight(
    @Param('id') idFlight: number,
    @Body() updateFlightDto: CreateFlightDto,
  ) {
    return await this.client
      .send('flight.update', { idFlight, updateFlightDto })
      .toPromise();
  }

  @Delete('delete-flight/:id')
  async deleteFlight(@Param('id') idFlight: number) {
    return await this.client.send('flight.delete', idFlight).toPromise();
  }

  @Post('create-plane')
  async createPlane(@Body() createPlaneDto: CreatePlaneDto) {
    return await this.client.send('plane.create', createPlaneDto).toPromise();
  }

  @Put('update-plane/:id')
  async updatePlane(
    @Param('id') idPlane: number,
    @Body() updatePlaneDto: CreatePlaneDto,
  ) {
    return await this.client
      .send('plane.update', { idPlane, updatePlaneDto })
      .toPromise();
  }

  @Delete('delete-plane/:id')
  async deletePlane(@Param('id') idPlane: number) {
    return await this.client.send('plane.delete', idPlane).toPromise();
  }

  @Post('create-airline')
  async createAirline(@Body() createAirlineDto: CreateAirlineDto) {
    return await this.client
      .send('airline.create', createAirlineDto)
      .toPromise();
  }

  @Put('update-airline/:id')
  async updateAirline(
    @Param('id') idAirlines: number,
    @Body() updateAirlineDto: CreateAirlineDto,
  ) {
    return await this.client
      .send('airline.update', { idAirlines, updateAirlineDto })
      .toPromise();
  }

  @Delete('delete-airline/:id')
  async deleteAirline(@Param('id') idAirlines: number) {
    return await this.client.send('airline.delete', idAirlines).toPromise();
  }

  @Get('flights')
  async getAllFlights() {
    return await this.client.send('flights.getAll', {}).toPromise();
  }

  @Get('flight/:id')
  async getFlightById(@Param('id') idFlight: number) {
    return await this.client.send('flight.getById', idFlight).toPromise();
  }

  @Get('planes')
  async getAllPlanes() {
    return await this.client.send('planes.getAll', {}).toPromise();
  }

  @Get('plane/:id')
  async getPlaneById(@Param('id') idPlane: number) {
    return await this.client.send('plane.getById', idPlane).toPromise();
  }

  @Get('airlines')
  async getAllAirlines() {
    return await this.client.send('airlines.getAll', {}).toPromise();
  }

  @Get('airline/:id')
  async getAirlineById(@Param('id') idAirlines: number) {
    return await this.client.send('airline.getById', idAirlines).toPromise();
  }
}
