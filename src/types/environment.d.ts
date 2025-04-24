export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      JWT_SECRET: string;
      CLIENT_URL: string;
      API_URL: string;
      HTTP_PORT: number;
      SOCKET_PORT: number;
      ENV: 'test' | 'dev' | 'prod';
    }
  }
}
