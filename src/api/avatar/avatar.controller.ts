import { Request, Response } from 'express';
import prisma from '../../database/index.js';
import fs from 'fs';
import path from 'path';

class AvatarController {
    async upload(req: Request, res: Response) {
        if (!req.file) {
            return res.status(400).json({ error: 'Bad Request', error_message: 'Файл не был загружен.' });
        }

        const userId = req.jwt.id;
        const filename = req.file.filename; // Теперь TypeScript не орет на тебя как строгая училка

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { avatar_hash: true }
        });

        // Удаление старого аватара, если он есть
        if (user?.avatar_hash) {
            const possibleExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
            for (const ext of possibleExtensions) {
                const oldPath = path.resolve('public/avatars', user.avatar_hash + ext);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                    break; // Удаляем только один старый файл
                }
            }
        }

        await prisma.user.update({
            where: { id: userId },
            data: { avatar_hash: filename.split('.')[0] } // Сохраняем имя без расширения
        });

        res.json({ success: true, avatar: `${process.env.API_URL}/public/avatars/${filename}` });
    }
}

export default new AvatarController();
