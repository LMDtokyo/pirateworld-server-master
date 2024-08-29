import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { readdirSync } from 'fs';
import prisma from '../../database/index.js';
import issueTokens from '../../helpers/issueTokens.js';
import { cancelRevokeJob } from '../../helpers/refreshToken.js';

class AuthController {
  async signin(req: Request<null, null, { login: string; password: string }>, res: Response) {
    const { login, password } = req.body;

    const user = await prisma.user.findUnique({ where: { login } });

    if (!user) return res.status(400).json({ error: 'Неверный логин', error_message: 'Пользователь не найден' });

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ error: 'Неверный пароль', error_message: 'Неверный пароль' });
    }

    const tokens = await issueTokens(user.id);

    res.json(tokens);
  }

  async signup(req: Request<null, null, { login: string; password: string; email: string }>, res: Response) {
    const { login, password, email } = req.body;

    const user = await prisma.user.findUnique({ where: { login } });

    if (user) {
      return res.status(400).json({
        error: 'Логин занят',
        error_message: 'Пользователь с таким логином уже существует'
      });
    }

    const avatars = readdirSync('./public/avatars').map(fileName => fileName.split('.')[0]);

    await prisma.user.create({
      data: {
        login,
        email,
        avatar_hash: avatars[Math.floor(Math.random() * avatars.length)],
        password: bcrypt.hashSync(password, 7),
        resources: { create: {} },
        inventory: { create: { type: 'Player' } }
      }
    });

    res.status(201).json({ message: 'Пользователь был создан' });
  }

  async refresh(req: Request<null, null, { refresh_token: string }>, res: Response) {
    const { refresh_token } = req.body;

    const token = await prisma.refreshToken.findFirst({
      where: { token: refresh_token, expires_at: { gt: new Date() } }
    });

    if (!token) return res.status(400).json({ error: 'Bad Request', error_message: 'Refresh token invalid' });

    await prisma.refreshToken.delete({ where: { id: token.id } });
    cancelRevokeJob(token.id);

    const tokens = await issueTokens(token.userId);

    res.json(tokens);
  }

  async revoke(req: Request<null, null, { refresh_token: string }>, res: Response) {
    const { refresh_token } = req.body;

    const token = await prisma.refreshToken.findFirst({
      where: { token: refresh_token, expires_at: { gt: new Date() } }
    });

    if (!token) return res.status(400).json({ error: 'Bad Request', error_message: 'Refresh token invalid' });

    await prisma.refreshToken.delete({ where: { id: token.id } });
    cancelRevokeJob(token.id);

    res.json({ message: `Refresh token has been deleted` });
  }

  async me(req: Request, res: Response) {
    const { login, email, email_confirmed } = await prisma.user.findUniqueOrThrow({
      where: { id: req.jwt.id },
      select: {
        login: true,
        email: true,
        email_confirmed: true
      }
    });

    res.json({ id: req.jwt.id, login, email, email_confirmed });
  }
}

export default new AuthController();
