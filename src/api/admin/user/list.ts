import { Request, Response } from 'express';
import prisma from '../../../database/index.js';

export default async function listUsersHandler(req: Request, res: Response) {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                login: true,
                lvl: true,
                email: true,
                last_active_at: true
            },
            orderBy: { id: 'asc' }
        });

        res.json(users);
    } catch (err) {
        console.error('[ADMIN USER LIST ERROR]', err);
        res.status(500).json({ error: 'Server error' });
    }
}
