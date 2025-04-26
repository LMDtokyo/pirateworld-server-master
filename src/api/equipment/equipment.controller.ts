import { Request, Response } from 'express';
import prisma from '../../database/index.js';

class EquipmentController {
    // Получить список экипированных предметов
    async getEquipment(req: Request, res: Response) {
        try {
            const playerId = req.jwt.id;

            const equipment = await prisma.userEquipment.findMany({
                where: { userId: playerId },
                include: { item: true }
            });

            res.json({ success: true, equipment });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Error', error_message: 'Не удалось получить экипировку' });
        }
    }

    // Надеть предмет
    async equipItem(req: Request, res: Response) {
        try {
            const playerId = req.jwt.id;
            const { itemId } = req.body;

            const inventoryItem = await prisma.inventoryItems.findFirst({
                where: {
                    inventory: { ownerId: playerId },
                    itemId,
                    count: { gt: 0 }
                }
            });

            if (!inventoryItem) {
                return res.status(400).json({ error: 'Bad Request', error_message: 'Предмет отсутствует в инвентаре' });
            }

            await prisma.$transaction([
                prisma.inventoryItems.update({
                    where: { key: { inventoryId: inventoryItem.inventoryId, slot: inventoryItem.slot } },
                    data: { count: { decrement: 1 } }
                }),
                prisma.userEquipment.create({
                    data: {
                        userId: playerId,
                        itemId
                    }
                })
            ]);

            await this.recalculateStats(playerId);

            res.json({ success: true, message: `Предмет ${itemId} успешно экипирован.` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Error', error_message: 'Не удалось экипировать предмет' });
        }
    }

    // Снять предмет
    async unequipItem(req: Request, res: Response) {
        try {
            const playerId = req.jwt.id;
            const { equipmentId } = req.body;

            const equipment = await prisma.userEquipment.findUnique({
                where: { id: equipmentId },
                include: { item: true }
            });

            if (!equipment || equipment.userId !== playerId) {
                return res.status(400).json({ error: 'Bad Request', error_message: 'Экипировка не найдена' });
            }

            const inventory = await prisma.inventory.findUnique({
                where: { ownerId: playerId }
            });

            if (!inventory) {
                return res.status(404).json({ error: 'Not Found', error_message: 'Инвентарь не найден' });
            }

            // Ищем свободный слот
            const usedSlots = await prisma.inventoryItems.findMany({
                where: { inventoryId: inventory.id }
            });

            const usedSlotNumbers = usedSlots.map(s => s.slot);
            let freeSlot = 1;
            while (usedSlotNumbers.includes(freeSlot)) {
                freeSlot++;
            }

            await prisma.$transaction([
                prisma.userEquipment.delete({ where: { id: equipmentId } }),
                prisma.inventoryItems.create({
                    data: {
                        inventoryId: inventory.id,
                        slot: freeSlot,
                        count: 1,
                        itemId: equipment.itemId
                    }
                })
            ]);

            await this.recalculateStats(playerId);

            res.json({ success: true, message: `Предмет успешно снят.` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Error', error_message: 'Не удалось снять предмет' });
        }
    }

    // Пересчёт статов игрока
    private async recalculateStats(userId: number) {
        try {
            const equipment = await prisma.userEquipment.findMany({
                where: { userId },
                include: { item: true }
            });

            let attack = 10;
            let defense = 0;
            let speed = 0;
            let maneuverability = 0;
            let luck = 0;
            let repairSpeed = 0;

            for (const eq of equipment) {
                attack += eq.item.bonusAttack;
                defense += eq.item.bonusDefense;
                speed += eq.item.bonusSpeed;
                maneuverability += eq.item.bonusManeuverability;
                luck += eq.item.bonusLuck;
                repairSpeed += eq.item.bonusRepairSpeed;
            }

            await prisma.user.update({
                where: { id: userId },
                data: {
                    attack,
                    defense,
                    speed,
                    maneuverability,
                    luck,
                    repairSpeed
                }
            });
        } catch (error) {
            console.error('Ошибка при пересчёте статов игрока', error);
        }
    }
}

export default new EquipmentController();
