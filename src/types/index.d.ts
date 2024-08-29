export interface TokenInterface {
  id: number;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    export interface Request {
      jwt: TokenInterface;
    }
  }
}
