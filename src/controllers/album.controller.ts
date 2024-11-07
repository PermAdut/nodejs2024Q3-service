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
import { Request, Response } from 'express';
import {
  createAlbum,
  deleteAlbum as deleteAlbumFromDB,
  getAlbumById as getAlbumByIdFromDB,
  getAlbums as getAlbumsFromDB,
  updateAlbum as updateAlbumInDB,
} from 'src/database/db';
import { CreateAlbumDto, UpdateAlbumDto } from 'src/utils/requestBodies';

@Controller('album')
export class AlbumController {
  @Get()
  async getAlbums() {
    const albums = await getAlbumsFromDB();
    return albums;
  }

  @Get(':id')
  async getAlbumById(@Param() param: any, @Res() response: Response) {
    try {
      const album = await getAlbumByIdFromDB(param.id);
      response.status(200).json(album).send();
    } catch (err) {
      if (err.message == 'Invalid uuid') {
        response.status(400).send();
      } else if (err.message == 'Album not found') {
        response.status(404).send();
      }
    }
  }

  @Post()
  async addAlbum(@Res() response: Response, @Req() request: Request) {
    const body = request.body as unknown as CreateAlbumDto;
    try {
      const album = await createAlbum(body);
      response.status(201).json(album).send();
    } catch (err) {
      if (err.message == 'body doest not contain required fields') {
        response.status(400).send();
      }
    }
  }

  @Put(':id')
  async updateAlbum(
    @Param() param: any,
    @Res() response: Response,
    @Req() request: Request,
  ) {
    const body = request.body as unknown as UpdateAlbumDto;
    try {
      const album = await updateAlbumInDB(param.id, body);
      response.status(200).json(album).send();
    } catch (err) {
      if (err.message == 'Invalid uuid') {
        response.status(400).send();
      } else if (err.message == 'Album not found') {
        response.status(404).send();
      } else if (err.message == 'body doest not contain required fields') {
        response.status(400).send();
      }
    }
  }

  @Delete(':id')
  async deleteAlbum(@Param() param: any, @Res() response: Response) {
    try {
      const delAlbum = await deleteAlbumFromDB(param.id);
      response.status(204).json(delAlbum).send();
    } catch (err) {
      if (err.message == 'Invalid uuid') {
        response.status(400).send();
      } else if (err.message == 'Album not found') {
        response.status(404).send();
      }
    }
  }
}
