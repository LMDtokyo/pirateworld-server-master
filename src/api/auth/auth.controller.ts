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

    if (!user) {
      return res.status(400).json({ error: 'Неверный логин', error_message: 'Пользователь не найден' });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ error: 'Неверный пароль', error_message: 'Неверный пароль' });
    }

    const tokens = await issueTokens(user.id);

    res.json({
      ...tokens,
      user: {
        id: user.id,
        login: user.login,
        isAdmin: user.isAdmin // добавлено
      }
    });
  }

  async signup(req: Request<null, null, { login: string; password: string; email: string }>, res: Response) {
    const { login, password, email } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ login }, { email }] }
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Conflict',
        error_message: 'Пользователь с таким логином или email уже существует'
      });
    }

    const avatars = readdirSync('./public/avatars')
        .filter(fileName => /\.(png|jpg|jpeg|webp)$/.test(fileName))
        .map(fileName => fileName.split('.')[0]);

    const newUser = await prisma.user.create({
      data: {
        login,
        email,
        avatar_hash: avatars.length ? avatars[Math.floor(Math.random() * avatars.length)] : null,
        password: bcrypt.hashSync(password, 7),
        resources: { create: {} },
        inventory: { create: { type: 'Player' } }
      }
    });

    const tokens = await issueTokens(newUser.id);

    res.status(201).json({
      ...tokens,
      user: {
        id: newUser.id,
        login: newUser.login,
        isAdmin: newUser.isAdmin
      }
    });
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
    const { login, email, email_confirmed, isAdmin } = await prisma.user.findUniqueOrThrow({
      where: { id: req.jwt.id },
      select: {
        login: true,
        email: true,
        email_confirmed: true,
        isAdmin: true
      }
    });

    res.json({ id: req.jwt.id, login, email, email_confirmed, isAdmin });
  }
}

export default new AuthController();
