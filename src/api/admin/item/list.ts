// routes/admin/item/list.js
import { Request, Response } from 'express';
import prisma from '../../../database/index.js';

export default async function listItemsHandler(req: Request, res: Response) {
  try {
    const items = await prisma.item.findMany({
      select: {
        name: true,
        label: true,
        weight: true,
        sell_price: true,
        max_stack_size: true,
        image: true
      },
      orderBy: { name: 'asc' }
    });

    res.json(items);
  } catch (err) {
    console.error('[ADMIN ITEM LIST ERROR]', err);
    res.status(500).json({ error: 'Server error' });
  }
}
