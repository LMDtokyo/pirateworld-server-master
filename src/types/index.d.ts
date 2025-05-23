import { Multer } from 'multer';

export interface TokenInterface {
  id: number;
  iat: number;
  exp: number;
  isAdmin: boolean; // ← добавлено, если ты передаёшь isAdmin в JWT
}

declare global {
  namespace Express {
    export interface Request {
      jwt: TokenInterface;
      file?: Multer.File;
      files?: Multer.File[];
    }
  }

  // Типизация для auth API
  interface IUser {
    id: number;
    login: string;
    email?: string;
    email_confirmed?: boolean;
    isAdmin: boolean;
  }

  interface ISigninResponse {
    access_token: string;
    refresh_token: string;
    user: IUser;
  }

  interface ISignupResponse {
    access_token: string;
    refresh_token: string;
    user: IUser;
  }

  interface IRefreshResponse {
    access_token: string;
    refresh_token: string;
  }

  interface IRevokeResponse {
    message: string;
  }

  type IMeResponse = IUser;

  interface IAuthState {
    user?: IUser;
    access_token: string | null;
    refresh_token: string | null;
  }
}
