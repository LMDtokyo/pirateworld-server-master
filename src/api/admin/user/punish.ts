import { Request, Response } from 'express';
import prisma from '../../../database/index.js';

export default async function punishUserHandler(req: Request, res: Response) {
    const { userId, type, reason, durationMinutes } = req.body;

    if (!userId || !type || !reason) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const validTypes = ['ban', 'mute'];
    if (!validTypes.includes(type)) {
        return res.status(400).json({ error: 'Invalid punishment type' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const expiresAt = durationMinutes
            ? new Date(Date.now() + durationMinutes * 60 * 1000)
            : null;

        await prisma.punishment.create({
            data: {
                userId,
                type,
                reason,
                expiresAt
            }
        });

        res.json({ success: true, message: `${type} выдан пользователю` });
    } catch (err) {
        console.error('[ADMIN PUNISH ERROR]', err);
        res.status(500).json({ error: 'Server error' });
    }
}
