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
import {
  addTrack as addTrackToDB,
  deleteTrack as deleteTrackFromDB,
  getTrackById as getTrackByIdFromDB,
  getTracks as getTracksFromDB,
  updateTrack,
} from 'src/database/db';
import { Request, response, Response } from 'express';
import { CreateTrackDto, UpdateTrackDto } from 'src/utils/requestBodies';
@Controller('track')
export class TrackController {
  @Get()
  @HttpCode(200)
  async getTracks() {
    const tracks = await getTracksFromDB();
    return tracks;
  }

  @Get(':id')
  async getTrackById(@Param() params: any, @Res() response: Response) {
    const id = params.id;
    try {
      const track = await getTrackByIdFromDB(id);
      response.status(200).json(track).send();
    } catch (err) {
      if (err.message == 'Invalid uuid') {
        response.status(400).send();
      } else if (err.message == 'Track not found') {
        response.status(404).send();
      }
    }
  }

  @Post()
  async addTrack(@Req() request: Request, @Res() response: Response) {
    const body = request.body as unknown as CreateTrackDto;
    try {
      const resBody = await addTrackToDB(body);
      response.status(201).json(resBody);
    } catch (err) {
      if (err.message == 'body doest not contain required fields') {
        response.status(400).send();
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
      const res = await updateTrack(param.id, body);
      response.status(200).json(res).send();
    } catch (err) {
      if (err.message == 'Invalid uuid') {
        response.status(400).send();
      } else if (err.message == 'Track not found') {
        response.status(404).send();
      } else if (err.message == 'body doest not contain required fields') {
        response.status(400).send();
      }
    }
  }

  @Delete(':id')
  async deleteTrack(@Param() param: any, @Res() response: Response) {
    try {
      const del = await deleteTrackFromDB(param.id);
      response.status(204).json(del);
    } catch (err) {
      if (err.message == 'Invalid uuid') {
        response.status(400).send();
      } else if (err.message == 'Track not found') {
        response.status(404).send();
      }
    }
  }
}
