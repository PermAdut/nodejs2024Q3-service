export interface RegistrationDto {
  login: string;
  password: string;
  passportId: string;
  country: string;
  email?: string;
  telephone?: string;
}

export interface LoginDto {
  login: string;
  password: string;
}

export interface User {
  login: string;
  password: string;
  registrationSeal: number;
  passportId: string;
  country: string;
  email?: string;
  telephone?: string;
}
