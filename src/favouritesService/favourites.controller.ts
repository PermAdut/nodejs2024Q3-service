import { Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { FavouritesService } from './favourites.service';

@Controller('favs')
export class FavController {
  private favService: FavouritesService;
  constructor() {
    this.favService = new FavouritesService();
  }

  @Get()
  async getAllFavs() {
    const favs = await this.favService.getFavs();
    return favs;
  }

  @Post('track/:id')
  async addTrackToFav(@Param() param: any, @Res() response: Response) {
    try {
      const track = await this.favService.addFavsTrack(param.id);
      response.status(201).json(track).send();
    } catch (err) {
      if (err.message == 'Invalid uuid') {
        response.status(400).json('Invalid uuid').send();
      } else if (err.message == 'Invalid track') {
        response.status(422).json('Invalid track').send();
      }
    }
  }

  @Post('album/:id')
  async addAlbumToFav(@Param() param: any, @Res() response: Response) {
    try {
      const album = await this.favService.addFavsAlbum(param.id);
      response.status(201).json(album).send();
    } catch (err) {
      if (err.message == 'Invalid uuid') {
        response.status(400).json('Invalid uuid').send();
      } else if (err.message == 'Invalid album') {
        response.status(422).json('Invalid album').send();
      }
    }
  }

  @Post('artist/:id')
  async addArtistToFav(@Param() param: any, @Res() response: Response) {
    try {
      const artist = await this.favService.addFavsArtist(param.id);
      response.status(201).json(artist).send();
    } catch (err) {
      if (err.message == 'Invalid uuid') {
        response.status(400).json('Invalid uuid').send();
      } else if (err.message == 'Invalid artist') {
        response.status(422).json('Invalid artist').send();
      }
    }
  }

  @Delete('track/:id')
  async deleteTrackFromFav(@Param() param: any, @Res() response: Response) {
    try {
      const track = await this.favService.deleteFavsTrack(param.id);
      response.status(204).json(track).send();
    } catch (err) {
      if (err.message == 'Invalid uuid') {
        response.status(400).json('Invalid uuid').send();
      } else if (err.message == 'Invalid track') {
        response.status(404).json('Invalid track').send();
      }
    }
  }

  @Delete('album/:id')
  async deleteAlbumFromFav(@Param() param: any, @Res() response: Response) {
    try {
      const album = await this.favService.deleteFavsAlbum(param.id);
      response.status(204).json(album).send();
    } catch (err) {
      if (err.message == 'Invalid uuid') {
        response.status(400).json('Invalid uuid').send();
      } else if (err.message == 'Invalid album') {
        response.status(404).json('Invalid album').send();
      }
    }
  }

  @Delete('artist/:id')
  async deleteArtistFromFav(@Param() param: any, @Res() response: Response) {
    try {
      const artist = await this.favService.deleteFavsArtist(param.id);
      response.status(204).json(artist).send();
    } catch (err) {
      if (err.message == 'Invalid uuid') {
        response.status(400).json('Invalid uuid').send();
      } else if (err.message == 'Invalid artist') {
        response.status(404).json('Invalid artist').send();
      }
    }
  }
}
