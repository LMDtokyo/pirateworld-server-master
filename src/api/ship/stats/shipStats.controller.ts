import { Request, Response } from 'express';
import prisma from '../../../database/index.js';

class ShipStatsController {
    async calculateShipStats(req: Request, res: Response) {
        try {
            const playerId = req.jwt.id;

            const ship = await prisma.ship.findUnique({
                where: { userId: playerId },
                include: {
                    equipment: true,
                    crew: true
                }
            });

            if (!ship) {
                return res.status(404).json({ error: 'Not Found', error_message: 'Корабль не найден' });
            }

            // Базовые параметры корабля
            let attack = ship.attack;
            let speed = ship.speed;
            let defense = ship.defense;
            let luck = ship.luck;
            let repairSpeed = ship.repairSpeed;

            // Считаем бонусы от экипировки
            for (const eq of ship.equipment) {
                attack += eq.bonusAttack;
                speed += eq.bonusSpeed;
                defense += eq.bonusDefense;
            }

            // Считаем бонусы от экипажа
            for (const member of ship.crew) {
                attack += member.bonusAttack;
                speed += member.bonusSpeed;
                defense += member.bonusDefense;
                luck += member.bonusLuck;
                repairSpeed += member.bonusRepairSpeed;
            }

            // Вернуть актуальные статы
            res.json({
                success: true,
                stats: {
                    hp: ship.hp,
                    mana: ship.mana,
                    attack,
                    speed,
                    defense,
                    maneuverability: ship.maneuverability,
                    luck,
                    repairSpeed
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Error', error_message: 'Не удалось пересчитать статы корабля' });
        }
    }
}

export default new ShipStatsController();
