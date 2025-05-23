import { Request, Response } from 'express';
import prisma from '../../../database/index.js';

export default async function createItemHandler(req: Request, res: Response) {
    const {
        name,
        label,
        description = '-',
        typeId,
        weight,
        sell_price = 0,
        max_stack_size = 1,
        image,
        bonusAttack = 0,
        bonusDefense = 0,
        bonusSpeed = 0,
        bonusManeuverability = 0,
        bonusLuck = 0,
        bonusRepairSpeed = 0
    } = req.body;

    if (!name || !label || !typeId || !weight || !image) {
        return res.status(400).json({
            error: 'Missing required fields: name, label, typeId, weight, image'
        });
    }

    try {
        const exists = await prisma.item.findUnique({ where: { name } });
        if (exists) {
            return res.status(409).json({ error: 'Item with this name already exists' });
        }

        const newItem = await prisma.item.create({
            data: {
                name,
                label,
                description,
                typeId,
                weight,
                sell_price,
                max_stack_size,
                image,
                bonusAttack,
                bonusDefense,
                bonusSpeed,
                bonusManeuverability,
                bonusLuck,
                bonusRepairSpeed
            }
        });

        return res.status(201).json({
            success: true,
            message: `Предмет ${newItem.label} создан.`,
            item: newItem
        });
    } catch (err) {
        console.error('[ADMIN ITEM CREATE ERROR]', err);
        return res.status(500).json({ error: 'Server error' });
    }
}
