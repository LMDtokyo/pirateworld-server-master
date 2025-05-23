import { v4 as uuid } from 'uuid';
import prisma from '../database/index.js';
import jwt from 'jsonwebtoken';
import { addRevokeJob } from './refreshToken.js';

const HOUR = 60 * 1000 * 60;

export default async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      isAdmin: true // ← тут теперь корректно
    }
  });

  if (!user) {
    throw new Error('User not found while issuing tokens');
  }

  const result = await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: uuid(),
      expires_at: new Date(Date.now() + HOUR * 24 * 7)
    }
  });

  addRevokeJob(result.id, user.id, result.expires_at);

  return {
    refresh_token: result.token,
    access_token: jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    ),
    user: {
      id: user.id,
      isAdmin: user.isAdmin
    }
  };
};
