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
import {
  updateArtist as updateArtistInDB,
  createArtist,
  getArtistById as getArtistsByIdFromDB,
  getArtists as getArtistsFromDB,
  deleteArtist as deleteArtistFromDB,
} from 'src/database/db';
import { Request, Response } from 'express';
import { CreateArtistDto, UpdateArtistDto } from 'src/utils/requestBodies';
@Controller('artist')
export class ArtistController {
  @Get()
  async getArtists() {
    const artists = await getArtistsFromDB();
    return artists;
  }

  @Get(':id')
  async getArtistById(@Param() param: any, @Res() response: Response) {
    try {
      const artist = await getArtistsByIdFromDB(param.id);
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
      const artist = await createArtist(body);
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
      const updatedBody = await updateArtistInDB(param.id, body);
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
      const deletedArtist = await deleteArtistFromDB(param.id);
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
