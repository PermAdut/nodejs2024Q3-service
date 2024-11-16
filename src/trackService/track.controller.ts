import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateTrackDto, UpdateTrackDto } from 'src/utils/requestBodies';
import { TrackService } from './track.service';
@Controller('track')
export class TrackController {
  private trackService: TrackService;
  constructor() {
    this.trackService = new TrackService();
  }

  @Get()
  @HttpCode(200)
  async getTracks() {
    const tracks = await this.trackService.getTracks();
    return tracks;
  }

  @Get(':id')
  async getTrackById(@Param() params: any, @Res() response: Response) {
    const id = params.id;
    try {
      const track = await this.trackService.getTrackById(id);
      response.status(200).json(track).send();
    } catch (err) {
      if (err.message == 'Invalid uuid') {
        response.status(400).json('Invalid uuid').send();
      } else if (err.message == 'Track not found') {
        response.status(404).json('Track not found').send();
      }
    }
  }

  @Post()
  async addTrack(@Req() request: Request, @Res() response: Response) {
    const body = request.body as unknown as CreateTrackDto;
    try {
      const resBody = await this.trackService.createTrack(body);
      response.status(201).json(resBody);
    } catch (err) {
      if (err.message == 'body doest not contain required fields') {
        response
          .status(400)
          .json('body doest not contain required fields')
          .send();
      }
    }
  }

  @Put(':id')
  async updateTrackInfo(
    @Param() param: any,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const body = request.body as unknown as UpdateTrackDto;
    try {
      const res = await this.trackService.updateTrack(param.id, body);
      response.status(200).json(res).send();
    } catch (err) {
      if (err.message == 'Invalid uuid') {
        response.status(400).json('Invalid uuid').send();
      } else if (err.message == 'Track not found') {
        response.status(404).json('Track not found').send();
      } else if (err.message == 'body doest not contain required fields') {
        response
          .status(400)
          .json('body doest not contain required fields')
          .send();
      }
    }
  }

  @Delete(':id')
  async deleteTrack(@Param() param: any, @Res() response: Response) {
    try {
      const del = await this.trackService.deleteTrack(param.id);
      response.status(204).json(del);
    } catch (err) {
      if (err.message == 'Invalid uuid') {
        response.status(400).json('Invalid uuid').send();
      } else if (err.message == 'Track not found') {
        response.status(404).json('Track not found').send();
      }
    }
  }
}
