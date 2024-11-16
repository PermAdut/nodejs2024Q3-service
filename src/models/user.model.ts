export default interface User {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: Date | number; // timestamp of creation
  updatedAt: Date | number; // timestamp of last update
}

export interface UserInput {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
}
