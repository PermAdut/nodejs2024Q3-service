import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import Track from 'src/models/track.model';
import { isUUID } from 'class-validator';
import { CreateTrackDto, UpdateTrackDto } from 'src/utils/requestBodies';
import { v4 } from 'uuid';

@Injectable()
export class TrackService {
  private prisma = new PrismaClient();

  public async getTracks(): Promise<Track[]> {
    return await this.prisma.track.findMany({});
  }

  public async getTrackById(id: string): Promise<Track> {
    const isMatch = isUUID(id);
    if (!isMatch) {
      throw new Error('Invalid uuid');
    }
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (track) {
      return track;
    } else {
      throw new Error('Track not found');
    }
  }

  public async createTrack(track: CreateTrackDto): Promise<Track> {
    const id = v4();
    if (!track.name || !track.duration) {
      throw new Error('body doest not contain required fields');
    }
    const newTrack: Track = {
      id: id,
      ...track,
    };
    await this.prisma.track.create({ data: newTrack });
    return newTrack;
  }

  public async deleteTrack(id: string): Promise<Track> {
    const isMatch = isUUID(id);
    if (!isMatch) {
      throw new Error('Invalid uuid');
    }
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (track) {
      await this.prisma.track.delete({ where: { id } });
      return track;
    } else {
      throw new Error('Track not found');
    }
  }

  public async updateTrack(
    id: string,
    upTrack: UpdateTrackDto,
  ): Promise<Track> {
    if (!upTrack.name || !upTrack.duration) {
      throw new Error('body doest not contain required fields');
    }
    const isMatch = isUUID(id);
    if (!isMatch) {
      throw new Error('Invalid uuid');
    }
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (track) {
      const res = await this.prisma.track.update({
        where: { id },
        data: {
          name: upTrack.name,
          duration: upTrack.duration,
          albumId: upTrack.albumId,
          artistId: upTrack.artistId,
        },
      });
      return res;
    } else {
      throw new Error('Track not found');
    }
  }
}
