import { Request, Response } from 'express';
import prisma from '../../database/index.js';

class LocationsController {
    async getLocations(req: Request, res: Response) {
        const locations = await prisma.location.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                requiredLevel: true,
                requiredShipLevel: true,
                rewardExp: true,
                rewardGold: true,
                difficulty: true
            }
        });

        res.json(locations);
    }

    async enterLocation(req: Request<{ id: string }>, res: Response) {
        const playerId = req.jwt.id;
        const locationId = Number(req.params.id);

        const location = await prisma.location.findUniqueOrThrow({
            where: { id: locationId }
        });

        const player = await prisma.user.findUniqueOrThrow({
            where: { id: playerId },
            select: {
                lvl: true,
                mana: true,
                hp: true
                // Тут можно добавить корабль, если он у тебя будет как отдельная модель
            }
        });

        // Проверка уровня игрока
        if (player.lvl < location.requiredLevel) {
            return res.status(403).json({
                error: 'Access Denied',
                error_message: `Требуется уровень ${location.requiredLevel} для входа в ${location.name}`
            });
        }

        // (если будет корабль — тут будет проверка уровня корабля)

        // Даем награду за вход
        await prisma.user.update({
            where: { id: playerId },
            data: {
                exp: { increment: location.rewardExp }
            }
        });

        res.json({
            message: `Вы вошли в ${location.name}`,
            rewardExp: location.rewardExp,
            rewardGold: location.rewardGold
        });
    }
}

export default new LocationsController();
