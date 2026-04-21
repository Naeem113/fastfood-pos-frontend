import { IUser } from "./user";

export interface ILoginResponse {
  token: string;
  refreshToken: string;
  user: IUser;
}

