import User from 'src/models/user.model';
import Artist from 'src/models/artist.model';
import Album from 'src/models/album.model';
import Favorites from 'src/models/favourites.model';
import Track from 'src/models/track.model';
import {
  CreateAlbumDto,
  CreateArtistDto,
  CreateTrackDto,
  CreateUserDto,
  UpdateAlbumDto,
  UpdateArtistDto,
  UpdatePasswordDto,
  UpdateTrackDto,
} from 'src/utils/requestBodies';
import { v4 } from 'uuid';
import { compare, genSalt, hash } from 'bcrypt';
import { config } from 'dotenv';
import { isUUID } from 'class-validator';
import { FavoritesResponse } from 'src/utils/responseBodies';
config();
const SALTVAL: string = process.env.CRYPT_SALT;
let SALT;
(async () => {
  SALT = await genSalt(parseInt(SALTVAL));
})();
const users: User[] = [];
const artists: Artist[] = [];
const tracks: Track[] = [];
const albums: Album[] = [];
const favourites: Favorites = {
  tracks: [],
  albums: [],
  artists: [],
};

enum FavoritesType {
  Artist = 'Artist',
  Album = 'Album',
  Track = 'Track',
}

// UserMethods

export async function getUsers(): Promise<User[]> {
  return users;
}

export async function getUserById(id: string): Promise<User> {
  const isMatch = isUUID(id, 4);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  const user = users.find((el) => el.id == id);
  if (user) {
    return user;
  } else {
    throw new Error('User not found');
  }
}

export async function addUser(
  user: CreateUserDto,
): Promise<Omit<User, 'password'>> {
  if (!user.login || !user.password) {
    throw new Error('body does not contain required fields');
  }
  const timestamp = Date.now();
  const newUser: User = {
    id: v4(),
    login: user.login,
    password: await hash(user.password, SALT),
    version: 1,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  users.push(newUser);
  const { password, ...responseAns } = newUser;
  return responseAns;
}

export async function updateUserPass(
  id: string,
  data: UpdatePasswordDto,
): Promise<Omit<User, 'password'>> {
  if (!data.newPassword || !data.oldPassword) {
    throw new Error('Invalid body');
  }
  const isMatch = isUUID(id, 4);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  const user = users.find((el) => el.id == id);
  if (!user) {
    throw new Error('User not found');
  }
  const isMatchPass = await compare(data.oldPassword, user.password);
  if (!isMatchPass) {
    throw new Error('Invalid password');
  }
  const timestamp = Date.now();
  user.password = await hash(data.newPassword, SALT);
  user.version++;
  user.updatedAt = timestamp;
  const { password, ...record } = user;
  return record;
}

export async function deleteUser(id: string): Promise<boolean> {
  const isMatch = isUUID(id, 4);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  const userIndex = users.findIndex((el) => el.id == id);
  if (userIndex != -1) {
    users.splice(userIndex, 1);
    return true;
  } else {
    throw new Error('User not found');
  }
}

// TracksMethods
export async function getTracks(): Promise<Track[]> {
  return tracks;
}

export async function getTrackById(id: string): Promise<Track> {
  const isMatch = isUUID(id);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  const track = tracks.find((el) => el.id == id);
  if (track) {
    return track;
  } else {
    throw new Error('Track not found');
  }
}

export async function addTrack(track: CreateTrackDto): Promise<Track> {
  const id = v4();
  if (!track.name || !track.duration) {
    throw new Error('body doest not contain required fields');
  }
  const newTrack: Track = {
    id: id,
    ...track,
  };
  tracks.push(newTrack);
  return newTrack;
}

export async function updateTrack(id: string, track: UpdateTrackDto) {
  if (!track.name || !track.duration) {
    throw new Error('body doest not contain required fields');
  }
  const isMatch = isUUID(id);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  const findTrack = tracks.find((el) => el.id == id);
  if (!findTrack) {
    throw new Error('Track not found');
  } else {
    Object.assign(findTrack, track);
    return findTrack;
  }
}

export async function deleteTrack(id: string): Promise<Track> {
  const isMatch = isUUID(id);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  const trackId = tracks.findIndex((el) => el.id == id);
  if (trackId != -1) {
    const result = tracks[trackId];
    tracks.splice(trackId, 1);
    await clearFavoutires(id, FavoritesType.Track);
    return result;
  } else {
    throw new Error('Track not found');
  }
}

//ArtistMethods

export async function getArtists(): Promise<Artist[]> {
  return artists;
}

export async function getArtistById(id: string): Promise<Artist> {
  const isMatch = isUUID(id);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  const artist = artists.find((el) => el.id == id);
  if (artist) {
    return artist;
  } else {
    throw new Error('Artist not found');
  }
}

export async function createArtist(artist: CreateArtistDto): Promise<Artist> {
  if (!artist.name || !artist.grammy) {
    throw new Error('body doest not contain required fields');
  }
  const id: string = v4();
  const newArtist: Artist = {
    id: id,
    ...artist,
  };
  artists.push(newArtist);
  return newArtist;
}

export async function deleteArtist(id: string): Promise<Artist> {
  const isMatch = isUUID(id);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  const artistIndex = artists.findIndex((el) => el.id == id);
  if (artistIndex != -1) {
    const artist = artists[artistIndex];
    artists.splice(artistIndex, 1);
    await clearFavoutires(id, FavoritesType.Artist);
    tracks.forEach((el) => {
      if (el.artistId === artist.id) {
        el.artistId = null;
      }
    });
    albums.forEach((el) => {
      if (el.artistId === artist.id) {
        el.artistId = null;
      }
    });
    return artist;
  } else {
    throw new Error('Artist not found');
  }
}

export async function updateArtist(
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
  const findArtist = artists.find((el) => el.id == id);
  if (findArtist) {
    Object.assign(findArtist, artist);
    return findArtist;
  } else {
    throw new Error('Artist not found');
  }
}

//AlbumMethods

export async function getAlbums(): Promise<Album[]> {
  return albums;
}

export async function getAlbumById(id: string): Promise<Album> {
  const isMatch = isUUID(id);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  const album = albums.find((el) => el.id == id);
  if (album) {
    return album;
  } else {
    throw new Error('Album not found');
  }
}

export async function createAlbum(album: CreateAlbumDto): Promise<Album> {
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
  albums.push(newAlbum);
  return newAlbum;
}

export async function deleteAlbum(id: string): Promise<Album> {
  const isMatch = isUUID(id);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  const albumId = albums.findIndex((el) => el.id == id);
  if (albumId != -1) {
    const alb = albums[albumId];
    albums.splice(albumId, 1);
    await clearFavoutires(id, FavoritesType.Album);
    tracks.forEach((el) => {
      if (el.albumId === alb.id) {
        el.albumId = null;
      }
    });
    return alb;
  } else {
    throw new Error('Album not found');
  }
}

export async function updateAlbum(
  id: string,
  album: UpdateAlbumDto,
): Promise<Album> {
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
  const findAlbum = albums.find((el) => el.id == id);
  if (findAlbum) {
    Object.assign(findAlbum, album);
    return findAlbum;
  } else {
    throw new Error('Album not found');
  }
}

// FavouritesMethods

export async function getFavs(): Promise<FavoritesResponse> {
  const res: FavoritesResponse = {
    albums: [],
    artists: [],
    tracks: [],
  };
  favourites.albums.forEach(async (el) => {
    const album: Album = await getAlbumById(el);
    res.albums.push(album);
  });
  favourites.artists.forEach(async (el) => {
    const artist: Artist = await getArtistById(el);
    res.artists.push(artist);
  });
  favourites.tracks.forEach(async (el) => {
    const track: Track = await getTrackById(el);
    res.tracks.push(track);
  });
  return res;
}

export async function deleteFavsTrack(id: string) {
  const isMatch = isUUID(id);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  const trackIndex = favourites.tracks.findIndex((el) => el == id);
  if (trackIndex != -1) {
    favourites.tracks.splice(trackIndex, 1);
  } else {
    throw new Error('Track not found');
  }
}

export async function deleteFavsAlbum(id: string) {
  const isMatch = isUUID(id);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  const albumIndex = favourites.albums.findIndex((el) => el == id);
  if (albumIndex != -1) {
    favourites.albums.splice(albumIndex, 1);
  } else {
    throw new Error('Track not found');
  }
}

export async function deleteFavsArtist(id: string) {
  const isMatch = isUUID(id);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  const artistIndex = favourites.artists.findIndex((el) => el == id);
  if (artistIndex != -1) {
    favourites.artists.splice(artistIndex, 1);
  } else {
    throw new Error('Track not found');
  }
}

export async function addFavTrack(id: string): Promise<Track> {
  const isMatch = isUUID(id);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  try {
    const track = await getTrackById(id);
    favourites.tracks.push(track.id);
    return track;
  } catch {
    throw new Error('Invalid track');
  }
}

export async function addFavAlbum(id: string): Promise<Album> {
  const isMatch = isUUID(id);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  try {
    const album = await getAlbumById(id);
    favourites.albums.push(album.id);
    return album;
  } catch {
    throw new Error('Invalid album');
  }
}

export async function addFavArtist(id: string): Promise<Artist> {
  const isMatch = isUUID(id);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  try {
    const artist = await getArtistById(id);
    favourites.artists.push(artist.id);
    return artist;
  } catch {
    throw new Error('Invalid artist');
  }
}

async function clearFavoutires(id: string, type: FavoritesType): Promise<void> {
  switch (type) {
    case FavoritesType.Artist:
      const artistIndex = favourites.artists.findIndex((el) => el == id);
      if (artistIndex != -1) {
        favourites.artists.splice(artistIndex, 1);
      }
      break;
    case FavoritesType.Album:
      const albumIndex = favourites.albums.findIndex((el) => el == id);
      if (albumIndex != -1) {
        favourites.albums.splice(albumIndex, 1);
      }
      break;
    case FavoritesType.Track:
      const trackIndex = favourites.tracks.findIndex((el) => el == id);
      if (trackIndex != -1) {
        favourites.tracks.splice(trackIndex, 1);
      }
      break;
  }
}
