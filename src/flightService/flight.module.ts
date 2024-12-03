import { Module } from '@nestjs/common';
import { FlightsService } from './flight.service';
import { FlightsController } from './flight.controller';

@Module({
  imports: [],
  controllers: [FlightsController],
  providers: [FlightsService],
})
export class FlightModule {}
