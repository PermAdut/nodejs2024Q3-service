export interface CreateUserDto {
  login: string;
  password: string;
}

export interface UpdatePasswordDto {
  oldPassword: string; // previous password
  newPassword: string; // new password
}

export interface CreateTrackDto {
  name: string;
  duration: number;
  artistId: string | null;
  albumId: string | null;
}

export interface UpdateTrackDto {
  name: string;
  duration: number;
  artistId: string | null;
  albumId: string | null;
}

export interface CreateArtistDto {
  name: string;
  grammy: boolean;
}

export interface UpdateArtistDto {
  name: string;
  grammy: boolean;
}

export interface CreateAlbumDto {
  name: string;
  year: number;
  artistId: string | null;
}

export interface UpdateAlbumDto {
  name: string;
  year: number;
  artistId: string | null;
}
