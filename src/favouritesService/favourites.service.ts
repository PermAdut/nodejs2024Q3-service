import { Injectable } from '@nestjs/common';
import { PrismaClient, Track, Artist, Album } from '@prisma/client';
import { isUUID } from 'class-validator';
import { FavoritesResponse } from 'src/utils/responseBodies';
@Injectable()
export class FavouritesService {
  private prisma = new PrismaClient();

  public async getFavs(): Promise<FavoritesResponse> {
    const records = await this.prisma.favourites.findFirst({});
    const trackIds = records.tracks;
    const albumIds = records.albums;
    const artistIds = records.albums;
    const favsTrack: Track[] = [];
    const favsAlbums: Album[] = [];
    const favsArtist: Artist[] = [];
    trackIds.forEach(async (el) => {
      favsTrack.push(await this.prisma.track.findUnique({ where: { id: el } }));
    });
    albumIds.forEach(async (el) => {
      favsAlbums.push(
        await this.prisma.album.findUnique({ where: { id: el } }),
      );
    });
    artistIds.forEach(async (el) => {
      favsArtist.push(
        await this.prisma.artist.findUnique({ where: { id: el } }),
      );
    });
    return {
      artists: favsArtist,
      albums: favsAlbums,
      tracks: favsTrack,
    };
  }

  public async deleteFavsTrack(id: string): Promise<void> {
    const isMatch = isUUID(id);
    if (!isMatch) {
      throw new Error('Invalid uuid');
    }
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (track) {
      const favs = await this.prisma.favourites.findFirst({});
      const updatedTracks = favs.tracks.filter((el) => el != track.id);
      await this.prisma.favourites.update({
        where: {
          artists: favs.artists,
          albums: favs.albums,
        },
        data: { tracks: updatedTracks },
      });
    } else {
      throw new Error('Invalid track');
    }
  }

  public async deleteFavsAlbum(id: string): Promise<void> {
    const isMatch = isUUID(id);
    if (!isMatch) {
      throw new Error('Invalid uuid');
    }
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (album) {
      const favs = await this.prisma.favourites.findFirst({});
      const updatedAlbums = favs.albums.filter((el) => el != album.id);
      await this.prisma.favourites.update({
        where: {
          artists: favs.artists,
          tracks: favs.tracks,
        },
        data: { albums: updatedAlbums },
      });
    } else {
      throw new Error('Invalid album');
    }
  }

  public async deleteFavsArtist(id: string): Promise<void> {
    const isMatch = isUUID(id);
    if (!isMatch) {
      throw new Error('Invalid uuid');
    }
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (artist) {
      const favs = await this.prisma.favourites.findFirst({});
      const updatedArtists = favs.artists.filter((el) => el != artist.id);
      await this.prisma.favourites.update({
        where: {
          albums: favs.albums,
          tracks: favs.tracks,
        },
        data: { artists: updatedArtists },
      });
    } else {
      throw new Error('Invalid artist');
    }
  }

  public async addFavsTrack(id: string): Promise<Track> {
    const isMatch = isUUID(id);
    if (!isMatch) {
      throw new Error('Invalid uuid');
    }
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (track) {
      const favs = await this.prisma.favourites.findFirst({});
      favs.tracks.push(track.id);
      await this.prisma.favourites.updateMany({
        data: { tracks: favs.tracks },
      });
      return track;
    } else {
      throw new Error('Invalid track');
    }
  }

  public async addFavsArtist(id: string): Promise<Artist> {
    const isMatch = isUUID(id);
    if (!isMatch) {
      throw new Error('Invalid uuid');
    }
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (artist) {
      const favs = await this.prisma.favourites.findFirst({});
      favs.artists.push(artist.id);
      await this.prisma.favourites.updateMany({
        data: { artists: favs.artists },
      });
      return artist;
    } else {
      throw new Error('Invalid artist');
    }
  }

  public async addFavsAlbum(id: string): Promise<Album> {
    const isMatch = isUUID(id);
    if (!isMatch) {
      throw new Error('Invalid uuid');
    }
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (album) {
      const favs = await this.prisma.favourites.findFirst({});
      favs.albums.push(album.id);
      await this.prisma.favourites.updateMany({
        data: { albums: favs.albums },
      });
      return album;
    } else {
      throw new Error('Invalid album');
    }
  }
}
