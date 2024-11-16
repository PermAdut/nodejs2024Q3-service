import {
  Controller,
  Get,
  Res,
  Param,
  Post,
  Req,
  Put,
  Delete,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { Request, Response } from 'express';
import { CreateArtistDto, UpdateArtistDto } from 'src/utils/requestBodies';
@Controller('artist')
export class ArtistController {
  private artistService: ArtistService;
  constructor() {
    this.artistService = new ArtistService();
  }

  @Get()
  async getArtists() {
    const artists = await this.artistService.getArtists();
    return artists;
  }

  @Get(':id')
  async getArtistById(@Param() param: any, @Res() response: Response) {
    try {
      const artist = await this.artistService.getArtistById(param.id);
      response.status(200).json(artist).send();
    } catch (err) {
      if (err.message == 'Invalid uuid') {
        response.status(400).json('Invalid uuid').send();
      } else if (err.message == 'Artist not found') {
        response.status(404).json('Artist not found').send();
      }
    }
  }

  @Post()
  async addArtist(@Req() request: Request, @Res() response: Response) {
    const body = request.body as unknown as CreateArtistDto;
    try {
      const artist = await this.artistService.createArtist(body);
      response.status(201).json(artist).send();
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
  async updateArtist(
    @Param() param: any,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const body = request.body as unknown as UpdateArtistDto;
    try {
      const updatedBody = await this.artistService.updateArtist(param.id, body);
      response.status(200).json(updatedBody).send();
    } catch (err) {
      if (err.message == 'Invalid uuid') {
        response.status(400).json('Invalid uuid').send();
      } else if (err.message == 'Artist not found') {
        response.status(404).json('Artist not found').send();
      } else if (err.message == 'body doest not contain required fields') {
        response
          .status(400)
          .json('body doest not contain required fields')
          .send();
      }
    }
  }

  @Delete(':id')
  async deleteArtist(@Param() param: any, @Res() response: Response) {
    try {
      const deletedArtist = await this.artistService.deleteArtist(param.id);
      response.status(204).json(deletedArtist).send();
    } catch (err) {
      if (err.message == 'Invalid uuid') {
        response.status(400).json('Invalid uuid').send();
      } else if (err.message == 'Artist not found') {
        response.status(404).json('Artist not found').send();
      }
    }
  }
}
