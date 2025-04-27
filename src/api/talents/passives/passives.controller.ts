import { Request, Response } from 'express';
import prisma from '../../../database/index.js';

class PassivesController {
    async getPassiveSkills(req: Request, res: Response) {
        try {
            const skills = await prisma.passiveSkill.findMany({
                select: {
                    id: true,
                    name: true,
                    description: true,
                    bonusResourceDrop: true,
                    bonusHarpoonCd: true,
                    bonusMortarCd: true
                }
            });

            res.json({ success: true, skills });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Error', error_message: 'Не удалось получить список пассивных навыков' });
        }
    }

    async learnPassiveSkill(req: Request, res: Response) {
        try {
            const playerId = req.jwt.id;
            const { passiveId } = req.body;

            const user = await prisma.user.findUnique({
                where: { id: playerId },
                select: { skillPoints: true }
            });

            if (!user) {
                return res.status(404).json({ error: 'Not Found', error_message: 'Пользователь не найден' });
            }

            if (user.skillPoints <= 0) {
                return res.status(400).json({ error: 'Bad Request', error_message: 'Недостаточно очков навыков' });
            }

            const alreadyLearned = await prisma.userPassiveSkill.findFirst({
                where: {
                    userId: playerId,
                    passiveId
                }
            });

            if (alreadyLearned) {
                return res.status(400).json({ error: 'Bad Request', error_message: 'Навык уже изучен' });
            }

            await prisma.$transaction([
                prisma.userPassiveSkill.create({
                    data: {
                        userId: playerId,
                        passiveId
                    }
                }),
                prisma.user.update({
                    where: { id: playerId },
                    data: {
                        skillPoints: { decrement: 1 }
                    }
                })
            ]);

            res.json({ success: true, message: 'Пассивный навык успешно изучен.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Error', error_message: 'Не удалось изучить пассивный навык' });
        }
    }

    // 🎯 Новый метод - получить изученные пассивные навыки
    async getMyPassiveSkills(req: Request, res: Response) {
        try {
            const playerId = req.jwt.id;

            const skills = await prisma.userPassiveSkill.findMany({
                where: { userId: playerId },
                include: {
                    passiveSkill: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            bonusResourceDrop: true,
                            bonusHarpoonCd: true,
                            bonusMortarCd: true
                        }
                    }
                }
            });

            res.json({ success: true, skills: skills.map(s => s.passiveSkill) });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Error', error_message: 'Не удалось получить изученные пассивные навыки' });
        }
    }

    // 🎯 Новый метод - сброс всех изученных пассивных навыков
    async resetMyPassiveSkills(req: Request, res: Response) {
        try {
            const playerId = req.jwt.id;

            // Считаем сколько пассивок было изучено
            const skillsCount = await prisma.userPassiveSkill.count({
                where: { userId: playerId }
            });

            // Удаляем все пассивки
            await prisma.userPassiveSkill.deleteMany({
                where: { userId: playerId }
            });

            // Возвращаем обратно skillPoints
            await prisma.user.update({
                where: { id: playerId },
                data: {
                    skillPoints: { increment: skillsCount }
                }
            });

            res.json({ success: true, message: `Все пассивные навыки сброшены. Возвращено очков навыков: ${skillsCount}` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Error', error_message: 'Не удалось сбросить пассивные навыки' });
        }
    }
}

export default new PassivesController();
