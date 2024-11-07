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
    throw new Error('Body does not contain required fields');
  }
  //const isUser = users.findIndex((el) => el.login == user.login);
  const isUser = -1;
  if (isUser == -1) {
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
  } else {
    throw new Error('User already exists');
  }
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

export async function addTrack(track: CreateTrackDto): Promise<void> {
  const id = v4();
  const newTrack: Track = {
    id: id,
    ...track,
  };
  tracks.push(newTrack);
}

export async function updateTrack(id: string, track: UpdateTrackDto) {
  const isMatch = isUUID(id);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  const findTrack = tracks.find((el) => el.id == id);
  if (!findTrack) {
    throw new Error('Track not found');
  } else {
    Object.assign(findTrack, track);
  }
}

export async function deleteTrack(id: string) {
  const isMatch = isUUID(id);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  const trackId = tracks.findIndex((el) => el.id == id);
  if (trackId != -1) {
    tracks.splice(trackId, 1);
    await clearFavoutires(id, FavoritesType.Track);
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

export async function createArtist(artist: CreateArtistDto): Promise<void> {
  const id: string = v4();
  const newArtist: Artist = {
    id: id,
    ...artist,
  };
  artists.push(newArtist);
}

export async function deleteArtist(id: string) {
  const isMatch = isUUID(id);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  const artistIndex = artists.findIndex((el) => el.id == id);
  if (artistIndex != -1) {
    artists.splice(artistIndex, 1);
    await clearFavoutires(id, FavoritesType.Artist);
  } else {
    throw new Error('Artist not found');
  }
}

export async function updateArtist(id: string, artist: UpdatePasswordDto) {
  const isMatch = isUUID(id);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  const findArtist = artists.find((el) => el.id == id);
  if (findArtist) {
    Object.assign(findArtist, artist);
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

export async function createAlbum(album: CreateAlbumDto) {
  const id = v4();
  const newAlbum: Album = {
    id: id,
    ...album,
  };
  albums.push(newAlbum);
}

export async function deleteAlbum(id: string) {
  const isMatch = isUUID(id);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  const albumId = albums.findIndex((el) => el.id == id);
  if (albumId != -1) {
    albums.splice(albumId, 1);
    await clearFavoutires(id, FavoritesType.Album);
  } else {
    throw new Error('Album not found');
  }
}

export async function updateAlbum(id: string, album: UpdateAlbumDto) {
  const isMatch = isUUID(id);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  const findAlbum = albums.find((el) => el.id == id);
  if (findAlbum) {
    Object.assign(findAlbum, album);
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

export async function addFavTrack(id: string) {
  const isMatch = isUUID(id);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  const track = await getTrackById(id);
  if (track) {
    favourites.tracks.push(track.id);
  } else {
    throw new Error('Invalid track');
  }
}

export async function addFavAlbum(id: string) {
  const isMatch = isUUID(id);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  const album = await getAlbumById(id);
  if (album) {
    favourites.albums.push(album.id);
  } else {
    throw new Error('Invalid track');
  }
}

export async function addFavArtist(id: string) {
  const isMatch = isUUID(id);
  if (!isMatch) {
    throw new Error('Invalid uuid');
  }
  const artist = await getArtistById(id);
  if (artist) {
    favourites.artists.push(artist.id);
  } else {
    throw new Error('Invalid track');
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
