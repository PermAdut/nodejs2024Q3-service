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
import { AlbumService } from './album.service';
import { CreateAlbumDto, UpdateAlbumDto } from 'src/utils/requestBodies';

@Controller('album')
export class AlbumController {
  private albumService: AlbumService;
  constructor() {
    this.albumService = new AlbumService();
  }
  @Get()
  async getAlbums() {
    const albums = await this.albumService.getAlbums();
    return albums;
  }

  @Get(':id')
  async getAlbumById(@Param() param: any, @Res() response: Response) {
    try {
      const album = await this.albumService.getAlbumById(param.id);
      response.status(200).json(album).send();
    } catch (err) {
      if (err.message == 'Invalid uuid') {
        response.status(400).json('Invalid uuid').send();
      } else if (err.message == 'Album not found') {
        response.status(404).json('Album not found').send();
      }
    }
  }

  @Post()
  async addAlbum(@Res() response: Response, @Req() request: Request) {
    const body = request.body as unknown as CreateAlbumDto;
    try {
      const album = await this.albumService.createAlbum(body);
      response.status(201).json(album).send();
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
  async updateAlbum(
    @Param() param: any,
    @Res() response: Response,
    @Req() request: Request,
  ) {
    const body = request.body as unknown as UpdateAlbumDto;
    try {
      const album = await this.albumService.updateAlbum(param.id, body);
      response.status(200).json(album).send();
    } catch (err) {
      if (err.message == 'Invalid uuid') {
        response.status(400).json('Invalid uuid').send();
      } else if (err.message == 'Album not found') {
        response.status(404).json('Album not found').send();
      } else if (err.message == 'body doest not contain required fields') {
        response
          .status(400)
          .json('body doest not contain required fields')
          .send();
      }
    }
  }

  @Delete(':id')
  async deleteAlbum(@Param() param: any, @Res() response: Response) {
    try {
      const delAlbum = await this.albumService.deleteAlbum(param.id);
      response.status(204).json(delAlbum).send();
    } catch (err) {
      if (err.message == 'Invalid uuid') {
        response.status(400).json('Invalid uuid').send();
      } else if (err.message == 'Album not found') {
        response.status(404).json('Album not found').send();
      }
    }
  }
}
