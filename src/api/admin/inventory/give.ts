import { Request, Response } from 'express';
import prisma from '../../../database/index.js';

export default async function giveItemHandler(req: Request, res: Response) {
    const { userId, itemName, slot, count } = req.body;

    if (!userId || !itemName || slot === undefined || count === undefined) {
        return res.status(400).json({
            error: 'Missing required fields: userId, itemName, slot, count'
        });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const inventory = await prisma.inventory.findUnique({
            where: { ownerId: user.id }
        });
        if (!inventory) return res.status(404).json({ error: 'Inventory not found' });

        const item = await prisma.item.findUnique({ where: { name: itemName } });
        if (!item) return res.status(404).json({ error: 'Item not found' });

        const maxStack = item.max_stack_size || 1;

        const existing = await prisma.inventoryItems.findUnique({
            where: {
                key: {
                    inventoryId: inventory.id,
                    slot
                }
            }
        });

        if (existing) {
            const newCount = Math.min(existing.count + count, maxStack);
            await prisma.inventoryItems.update({
                where: {
                    key: {
                        inventoryId: inventory.id,
                        slot
                    }
                },
                data: { count: newCount }
            });
        } else {
            await prisma.inventoryItems.create({
                data: {
                    inventoryId: inventory.id,
                    slot,
                    itemId: item.name,
                    count: Math.min(count, maxStack)
                }
            });
        }

        return res.json({ success: true, message: `Предмет ${item.label} выдан.` });
    } catch (err) {
        console.error('[ADMIN GIVE ERROR]', err);
        return res.status(500).json({ error: 'Server error' });
    }
}
