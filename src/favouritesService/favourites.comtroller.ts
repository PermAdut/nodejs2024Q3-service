import { Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import {
  addFavAlbum,
  addFavArtist,
  addFavTrack,
  deleteFavsAlbum,
  deleteFavsArtist,
  deleteFavsTrack,
  getFavs,
} from 'src/database/db';

@Controller('favs')
export class FavController {
  @Get()
  async getAllFavs() {
    const favs = await getFavs();
    return favs;
  }

  @Post('track/:id')
  async addTrackToFav(@Param() param: any, @Res() response: Response) {
    try {
      const track = await addFavTrack(param.id);
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
      const album = await addFavAlbum(param.id);
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
      const artist = await addFavArtist(param.id);
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
      const track = await deleteFavsTrack(param.id);
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
      const album = await deleteFavsAlbum(param.id);
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
      const artist = await deleteFavsArtist(param.id);
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
