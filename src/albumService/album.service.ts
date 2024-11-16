import { Injectable } from '@nestjs/common';
import { Album, PrismaClient } from '@prisma/client';
import { isUUID } from 'class-validator';
import { CreateAlbumDto, UpdateAlbumDto } from 'src/utils/requestBodies';
import { v4 } from 'uuid';
Injectable();
export class AlbumService {
  private prisma = new PrismaClient();

  public async getAlbums() {
    return await this.prisma.album.findMany({});
  }

  public async getAlbumById(id: string): Promise<Album> {
    const isMatch = isUUID(id);
    if (!isMatch) {
      throw new Error('Invalid uuid');
    }
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (album) {
      return album;
    } else {
      throw new Error('Album not found');
    }
  }

  public async createAlbum(album: CreateAlbumDto): Promise<Album> {
    const keys = Object.keys(album);
    if (
      !keys.includes('artistId') ||
      !keys.includes('name') ||
      !keys.includes('year')
    ) {
      throw new Error('body doest not contain required fields');
    }
    const id = v4();
    const newAlbum: Album = {
      id: id,
      ...album,
    };
    const record = await this.prisma.album.create({ data: newAlbum });
    return record;
  }

  public async deleteAlbum(id: string): Promise<Album> {
    const isMatch = isUUID(id);
    if (!isMatch) {
      throw new Error('Invalid uuid');
    }
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (album) {
      await this.prisma.album.delete({ where: { id } });
      return album;
    } else {
      throw new Error('Album not found');
    }
  }

  public async updateAlbum(id: string, album: UpdateAlbumDto): Promise<Album> {
    const keys = Object.keys(album);
    if (
      !keys.includes('artistId') ||
      !keys.includes('name') ||
      !keys.includes('year') ||
      typeof album.year != 'number' ||
      typeof album.name != 'string'
    ) {
      throw new Error('body doest not contain required fields');
    }
    const isMatch = isUUID(id);
    if (!isMatch) {
      throw new Error('Invalid uuid');
    }
    const updateAlbum = await this.prisma.album.findUnique({ where: { id } });
    if (updateAlbum) {
      await this.prisma.album.update({
        where: { id },
        data: { name: album.name, year: album.year, artistId: album.artistId },
      });
      return await this.prisma.album.findUnique({ where: { id } });
    } else {
      throw new Error('Album not found');
    }
  }
}
