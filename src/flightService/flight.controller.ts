import {
  Controller,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Get,
} from '@nestjs/common';
import { FlightsService } from './flight.service'; // Импортируйте ваш сервис
import { CreateFlightDto } from './dto/create-flight.dto';
import { CreatePlaneDto } from './dto/create-plane.dto';
import { CreateAirlineDto } from './dto/create-airline.dto';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Post('create-flight')
  async createFlight(@Body() createFlightDto: CreateFlightDto) {
    return await this.flightsService.createFlight(createFlightDto);
  }

  @Put('update-flight/:id')
  async updateFlight(
    @Param('id') idFlight: number,
    @Body() updateFlightDto: CreateFlightDto,
  ) {
    return await this.flightsService.updateFlight(idFlight, updateFlightDto);
  }

  @Delete('delete-flight/:id')
  async deleteFlight(@Param('id') idFlight: number) {
    return await this.flightsService.deleteFlight(idFlight);
  }

  @Post('create-plane')
  async createPlane(@Body() createPlaneDto: CreatePlaneDto) {
    return await this.flightsService.createPlane(createPlaneDto);
  }

  @Put('update-plane/:id')
  async updatePlane(
    @Param('id') idPlane: number,
    @Body() updatePlaneDto: CreatePlaneDto,
  ) {
    return await this.flightsService.updatePlane(idPlane, updatePlaneDto);
  }

  @Delete('delete-plane/:id')
  async deletePlane(@Param('id') idPlane: number) {
    return await this.flightsService.deletePlane(idPlane);
  }

  @Post('create-airline')
  async createAirline(@Body() createAirlineDto: CreateAirlineDto) {
    return await this.flightsService.createAirline(createAirlineDto);
  }

  @Put('update-airline/:id')
  async updateAirline(
    @Param('id') idAirlines: number,
    @Body() updateAirlineDto: CreateAirlineDto,
  ) {
    return await this.flightsService.updateAirline(
      idAirlines,
      updateAirlineDto,
    );
  }

  @Delete('delete-airline/:id')
  async deleteAirline(@Param('id') idAirlines: number) {
    return await this.flightsService.deleteAirline(idAirlines);
  }

  @Get('flights')
  async getAllFlights() {
    return await this.flightsService.getAllFlights();
  }

  @Get('flight/:id')
  async getFlightById(@Param('id') idFlight: number) {
    return await this.flightsService.getFlightById(idFlight);
  }

  @Get('planes')
  async getAllPlanes() {
    return await this.flightsService.getAllPlanes();
  }

  @Get('plane/:id')
  async getPlaneById(@Param('id') idPlane: number) {
    return await this.flightsService.getPlaneById(idPlane);
  }

  @Get('airlines')
  async getAllAirlines() {
    return await this.flightsService.getAllAirlines();
  }

  @Get('airline/:id')
  async getAirlineById(@Param('id') idAirlines: number) {
    return await this.flightsService.getAirlineById(idAirlines);
  }

  @Get('health')
  async checkHealth() {
    return {
      message: 'Flight service works correctly',
    };
  }
}
