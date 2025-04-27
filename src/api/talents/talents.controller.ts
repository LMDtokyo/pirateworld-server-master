import { Request, Response } from 'express';
import prisma from '../../database/index.js';

class TalentsController {
    // 🎯 Изучить новый талант
    async learnTalent(req: Request, res: Response) {
        try {
            const playerId = req.jwt.id;
            const { talentId } = req.body;

            const user = await prisma.user.findUnique({
                where: { id: playerId },
                select: { skillPoints: true }
            });

            if (!user) {
                return res.status(404).json({ error: 'Not Found', error_message: 'Игрок не найден' });
            }

            if (user.skillPoints <= 0) {
                return res.status(400).json({ error: 'Bad Request', error_message: 'Недостаточно очков навыков' });
            }

            const alreadyLearned = await prisma.userTalent.findFirst({
                where: {
                    userId: playerId,
                    talentId
                }
            });

            if (alreadyLearned) {
                return res.status(400).json({ error: 'Bad Request', error_message: 'Талант уже изучен' });
            }

            await prisma.$transaction([
                prisma.userTalent.create({
                    data: {
                        userId: playerId,
                        talentId
                    }
                }),
                prisma.user.update({
                    where: { id: playerId },
                    data: {
                        skillPoints: { decrement: 1 }
                    }
                })
            ]);

            res.json({ success: true, message: `Талант успешно изучен.` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Error', error_message: 'Ошибка при изучении таланта' });
        }
    }

    // 🎯 Сбросить все таланты
    async resetTalents(req: Request, res: Response) {
        try {
            const playerId = req.jwt.id;

            // Считаем сколько талантов изучено
            const talentsCount = await prisma.userTalent.count({
                where: { userId: playerId }
            });

            // Удаляем все таланты
            await prisma.userTalent.deleteMany({
                where: { userId: playerId }
            });

            // Возвращаем skillPoints
            await prisma.user.update({
                where: { id: playerId },
                data: {
                    skillPoints: { increment: talentsCount }
                }
            });

            res.json({ success: true, message: `Все таланты сброшены. Возвращено очков: ${talentsCount}` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Error', error_message: 'Ошибка при сбросе талантов' });
        }
    }

    // 🎯 Новый метод — получить свои изученные таланты
    async getMyTalents(req: Request, res: Response) {
        try {
            const playerId = req.jwt.id;

            const talents = await prisma.userTalent.findMany({
                where: { userId: playerId },
                include: {
                    talent: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            bonusAttack: true,
                            bonusDefense: true,
                            bonusSpeed: true,
                            bonusLuck: true,
                            bonusMana: true,
                            specialSkill: true
                        }
                    }
                }
            });

            res.json({ success: true, talents: talents.map(t => t.talent) });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Error', error_message: 'Не удалось получить изученные таланты' });
        }
    }
}

export default new TalentsController();
