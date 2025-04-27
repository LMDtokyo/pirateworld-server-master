import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import routes from './api/index.js';
import errorHandler from './middlewares/error-handler.js';
import prisma from './database/index.js';
import socketEmitter from './ecs/helpers/SocketEmitter.js';

const app = express();

// Настройки приложения
app
    .use(morgan(':remote-addr | :method :url - :status - :response-time ms | :user-agent'))
    .use(express.json())
    .use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
    .use('/public', express.static('public'))
    .use('/', routes) // Главный роутинг
    .use('*', errorHandler); // Глобальный обработчик ошибок

// Создаём HTTP-сервер на базе Express
const httpServer = createServer(app);

// Инициализация WebSocket сервера
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL, credentials: true },
});

// Привязываем io к SocketEmitter
socketEmitter.setServer(io);

// Обработка событий подключения пользователей
io.on('connection', (socket) => {
  console.log('WebSocket: Пользователь подключился');

  socket.on('register', (userId) => {
    if (!userId) return;
    socket.join(`user:${userId}`);
    console.log(`WebSocket: Пользователь зарегистрирован в комнате user:${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('WebSocket: Пользователь отключился');
  });
});

// Запуск сервера
try {
  await prisma.$connect().then(() => console.log(`PRISMA: Успешное подключение к базе данных`));

  await import('./schedule/index.js'); // Планировщики

  const PORT = process.env.HTTP_PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`HTTP+WebSocket сервер запущен на порту: ${PORT}`);
  });
} catch (err) {
  console.error('Ошибка запуска сервера:', err);
}
