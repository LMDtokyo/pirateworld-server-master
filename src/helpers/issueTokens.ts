import { v4 as uuid } from 'uuid';
import prisma from '../database/index.js';
import jwt from 'jsonwebtoken';
import { addRevokeJob } from './refreshToken.js';

const HOUR = 60 * 1000 * 60;

export default async (userId: number) => {
  const result = await prisma.refreshToken.create({
    data: { userId: userId, token: uuid(), expires_at: new Date(Date.now() + HOUR * 24 * 7) }
  });

  addRevokeJob(result.id, userId, result.expires_at);

  return {
    refresh_token: result.token,
    access_token: jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' })
  };
};
