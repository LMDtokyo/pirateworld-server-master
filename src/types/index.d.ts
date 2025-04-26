import { Multer } from 'multer';

export interface TokenInterface {
  id: number;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    export interface Request {
      jwt: TokenInterface;
      file?: Multer.File;
      files?: Multer.File[];
    }
  }
}
