import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

import routes from './api/index.js';
import errorHandler from './middlewares/error-handler.js';
import prisma from './database/index.js';
import socketEmitter from './ecs/helpers/SocketEmitter.js';
import { registerChatHandlers } from './api/chat/chat.socket.js';

// Получаем абсолютный путь до корня проекта
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..'); // ← на уровень выше из build/

const app = express();

app
  .use(morgan(':remote-addr | :method :url - :status - :response-time ms | :user-agent'))
  .use(express.json())
  .use(cors({ origin: process.env.CLIENT_URL, credentials: true }))

  // ⬇️ Маршруты
  .use('/', routes)

  // ⬇️ Статические файлы (отдаём картинки)
  .use('/items', express.static(path.join(ROOT_DIR, 'public/items')))

  // ⬇️ Глобальный обработчик ошибок
  .use('*', errorHandler);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL, credentials: true }
});

socketEmitter.setServer(io);

io.on('connection', socket => {
  console.log('WebSocket: Пользователь подключился');

  socket.on('register', userId => {
    if (!userId) return;
    socket.join(`user:${userId}`);
    console.log(`WebSocket: Пользователь зарегистрирован в комнате user:${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('WebSocket: Пользователь отключился');
  });
});

try {
  await prisma.$connect();
  console.log(`PRISMA: Успешное подключение к базе данных`);

  await import('./schedule/index.js');

  const PORT = process.env.HTTP_PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`HTTP+WebSocket сервер запущен на порту: ${PORT}`);
    console.log(`🧪 Картинки доступны по адресу: http://localhost:${PORT}/items/<filename>`);
  });
} catch (err) {
  console.error('Ошибка запуска сервера:', err);
}

registerChatHandlers(io);
