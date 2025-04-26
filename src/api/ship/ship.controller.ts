import { Request, Response } from 'express';
import prisma from '../../database/index.js';

// Типы для тела запроса
interface EquipShipBody {
    type: 'cannon' | 'sail' | 'armor' | 'mortar';
    bonusAttack?: number;
    bonusSpeed?: number;
    bonusDefense?: number;
    bonusDamage?: number;
}

interface AddCrewBody {
    role: 'cook' | 'captain' | 'slave' | 'repairman' | 'sailor';
    bonusHp?: number;
    bonusAttack?: number;
    bonusSpeed?: number;
    bonusDefense?: number;
    bonusLuck?: number;
    bonusRepairSpeed?: number;
}

class ShipController {
    // Получение корабля вместе с экипировкой и командой
    async getShip(req: Request<Record<string, unknown>, unknown>, res: Response) {
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

            res.json({ success: true, ship });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Error', error_message: 'Не удалось получить корабль' });
        }
    }

    // Установка нового оборудования на корабль
    async equipShip(req: Request<Record<string, unknown>, unknown, EquipShipBody>, res: Response) {
        try {
            const playerId = req.jwt.id;
            const { type, bonusAttack = 0, bonusSpeed = 0, bonusDefense = 0, bonusDamage = 0 } = req.body;

            const ship = await prisma.ship.findUnique({ where: { userId: playerId } });

            if (!ship) {
                return res.status(404).json({ error: 'Not Found', error_message: 'Корабль не найден' });
            }

            // Ограничение: только 2 пушки
            if (type === 'cannon') {
                const cannons = await prisma.shipEquipment.count({
                    where: { shipId: ship.id, type: 'cannon' }
                });

                if (cannons >= 2) {
                    return res.status(400).json({ error: 'Bad Request', error_message: 'На корабле уже установлены 2 пушки' });
                }
            }

            await prisma.shipEquipment.create({
                data: {
                    shipId: ship.id,
                    type,
                    bonusAttack,
                    bonusSpeed,
                    bonusDefense,
                    bonusDamage
                }
            });

            res.json({ success: true, message: `Оборудование "${type}" успешно установлено.` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Error', error_message: 'Не удалось установить оборудование' });
        }
    }

    // Найм или замена члена команды
    async addCrew(req: Request<Record<string, unknown>, unknown, AddCrewBody>, res: Response) {
        try {
            const playerId = req.jwt.id;
            const { role, bonusHp = 0, bonusAttack = 0, bonusSpeed = 0, bonusDefense = 0, bonusLuck = 0, bonusRepairSpeed = 0 } = req.body;

            const ship = await prisma.ship.findUnique({ where: { userId: playerId } });

            if (!ship) {
                return res.status(404).json({ error: 'Not Found', error_message: 'Корабль не найден' });
            }

            const existingCrew = await prisma.shipCrew.findFirst({
                where: {
                    shipId: ship.id,
                    role
                }
            });

            if (existingCrew) {
                await prisma.shipCrew.delete({ where: { id: existingCrew.id } });
            }

            await prisma.shipCrew.create({
                data: {
                    shipId: ship.id,
                    role,
                    bonusHp,
                    bonusAttack,
                    bonusSpeed,
                    bonusDefense,
                    bonusLuck,
                    bonusRepairSpeed
                }
            });

            res.json({ success: true, message: `Член команды "${role}" успешно нанят.` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Error', error_message: 'Не удалось нанять члена команды' });
        }
    }
}

export default new ShipController();
