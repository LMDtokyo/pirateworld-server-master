import { Request, Response } from 'express';
import prisma from '../../database/index.js';

class StatusController {
    async updateActive(req: Request, res: Response) {
        const userId = req.jwt.id;

        await prisma.user.update({
            where: { id: userId },
            data: { last_active_at: new Date() }
        });

        res.json({ success: true });
    }

    async getStatus(req: Request<{ id: string }>, res: Response) {
        const userId = Number(req.params.id);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { last_active_at: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'Not Found', error_message: 'Пользователь не найден' });
        }

        const now = new Date();
        const lastActive = user.last_active_at ?? new Date(0);
        const diff = now.getTime() - lastActive.getTime();

        const isOnline = diff < 10 * 60 * 1000; // 10 минут

        res.json({ online: isOnline });
    }
}

export default new StatusController();
