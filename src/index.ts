import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import routes from './api/index.js';
import errorHandler from './middlewares/error-handler.js';

const app = express();

app
  .use(morgan(':remote-addr | :method :url - :status - :response-time ms | :user-agent'))
  .use(express.json())
  .use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
  .use('/public', express.static('public'))
  .use('/', routes)
  .use('*', errorHandler);

import prisma from './database/index.js';

try {
  await prisma.$connect().then(() => console.log(`PRISMA: Успешное подключение к базе данных`));
  await import('./schedule/index.js');

  app.listen(process.env.HTTP_PORT, () => {
    console.log('EXPRESS: Сервер запущен, порт:', process.env.HTTP_PORT);
  });
} catch (err) {
  console.error(err);
}
