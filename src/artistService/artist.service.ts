import { Injectable } from '@nestjs/common';
import { Artist, PrismaClient } from '@prisma/client';
import { isUUID } from 'class-validator';
import { CreateArtistDto, UpdateArtistDto } from 'src/utils/requestBodies';
import { v4 } from 'uuid';
@Injectable()
export class ArtistService {
  private prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  public async getArtists() {
    return await this.prisma.artist.findMany({});
  }

  public async getArtistById(id: string): Promise<Artist> {
    const isMatch = isUUID(id);
    if (!isMatch) {
      throw new Error('Invalid uuid');
    }
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (artist) {
      return artist;
    } else {
      throw new Error('Artist not found');
    }
  }

  public async createArtist(artist: CreateArtistDto): Promise<Artist> {
    if (!artist.name || !artist.grammy) {
      throw new Error('body doest not contain required fields');
    }
    const id: string = v4();
    const newArtist: Artist = {
      id: id,
      ...artist,
    };
    await this.prisma.artist.create({ data: newArtist });
    return newArtist;
  }

  public async deleteArtist(id: string): Promise<Artist> {
    const isMatch = isUUID(id);
    if (!isMatch) {
      throw new Error('Invalid uuid');
    }
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (artist) {
      await this.prisma.artist.delete({ where: { id } });
      // set null track
      return artist;
    } else {
      throw new Error('Artist not found');
    }
  }

  public async updateArtist(
    id: string,
    artist: UpdateArtistDto,
  ): Promise<Artist> {
    const keys = Object.keys(artist);
    if (
      !keys.includes('name') ||
      !keys.includes('grammy') ||
      typeof artist.name != 'string' ||
      typeof artist.grammy != 'boolean'
    ) {
      throw new Error('body doest not contain required fields');
    }
    const isMatch = isUUID(id);
    if (!isMatch) {
      throw new Error('Invalid uuid');
    }
    const upArtist = await this.prisma.artist.findUnique({ where: { id } });
    if (upArtist) {
      await this.prisma.artist.update({
        where: { id },
        data: { name: artist.name, grammy: artist.grammy },
      });
      return await this.prisma.artist.findUnique({ where: { id } });
    } else {
      throw new Error('Artist not found');
    }
  }
}
