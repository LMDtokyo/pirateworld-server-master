import prisma from '../database/index.js';
import { scheduledJobs, scheduleJob } from 'node-schedule';

const JOB_LABEL = 'revokeRefreshToken_';

export const revoke = (tokenId: number, userId: number) => {
  prisma.refreshToken
    .delete({ where: { id: tokenId } })
    .then(() => {
      console.log(`Рефреш токен пользователя ${userId} был удален. (Token expired)`);
    })
    .catch(err => {
      console.error(`Ошибка при удалении рефреш токена \`${tokenId}\``, err);
    });
};

export const addRevokeJob = (tokenId: number, userId: number, expires_at: Date) => {
  scheduleJob(JOB_LABEL + tokenId, expires_at, () => {
    revoke(tokenId, userId);
  });
};

export const cancelRevokeJob = (tokenId: number) => {
  scheduledJobs[JOB_LABEL + tokenId]?.cancel();
};
