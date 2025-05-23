import { Request, Response } from 'express';
import prisma from '../../../database/index.js';

export default async function listPunishmentsHandler(req: Request, res: Response) {
    try {
        const now = new Date();

        const punishments = await prisma.punishment.findMany({
            where: {
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: now } }
                ]
            },
            include: {
                user: {
                    select: { id: true, login: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(punishments);
    } catch (err) {
        console.error('[ADMIN PUNISH LIST ERROR]', err);
        res.status(500).json({ error: 'Server error' });
    }
}
