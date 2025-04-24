import { addRevokeJob, revoke } from "../helpers/refreshToken.js";
import prisma from '../database/index.js';

const tokens = await prisma.refreshToken.findMany({ select: { id: true, expires_at: true, userId: true } });

for (const token of tokens) {
  if (token.expires_at <= new Date()) {
    revoke(token.id, token.userId);

    continue;
  }

  addRevokeJob(token.id, token.userId, token.expires_at);
}

console.log(`Expired refresh-tokens handler started (tokens count: ${tokens.length})`);
