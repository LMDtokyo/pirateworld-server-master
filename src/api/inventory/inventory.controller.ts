import prisma from '../../database/index.js';
import resolveStackItem from "../../helpers/calcStackSize.js";
import type { Request, Response } from "express";

class InventoryController {
  async fetch(req: Request, res: Response) {
    const playerId = Number(req.jwt.id);
    const inventoryId = Number(req.params.id);

    const inventory = await prisma.inventory.findUniqueOrThrow({
      where: { id: inventoryId },
      select: {
        items: {
          select: {
            slot: true,
            count: true,
            item: {
              select: {
                name: true,
                max_stack_size: true,
                label: true,
                description: true,
                weight: true,
                image: true,
                sell_price: true
              }
            }
          }
        }, ownerId: true, size: true
      }
    });

    if (playerId !== inventory.ownerId) {
      return res.status(403).json({ error: 'Access Denied', error_message: 'У вас нет доступа к этому инвентарю' });
    }

    inventory.items.map(slot => {
      if (slot.item) {
        slot.item.image = process.env.API_URL + `/public/items/${slot.item.image}`;
      }
    });

    console.log(inventory);

    res.json({ ...inventory, slots: inventory.items, items: undefined });
  }

  async move(req: Request<{ id: string }, null, { from: number, to: number }>, res: Response) {
    const playerId = Number(req.jwt.id);
    const inventoryId = Number(req.params.id);
    const { from, to } = req.body;

    const inventory = await prisma.inventory.findUniqueOrThrow({
      where: { id: inventoryId },
      select: {
        ownerId: true,
        size: true,
        type: true,
        items: {
          where: { slot: { in: [from, to] } },
          select: {
            itemId: true,
            count: true,
            slot: true,
            item: {
              select: { max_stack_size: true }
            }
          }
        }
      }
    });

    if (playerId !== inventory.ownerId) {
      return res.status(403).json({ error: 'Access Denied', error_message: 'У вас нет доступа к этому инвентарю' });
    }

    if (to > inventory.size) {
      return res.status(400).json({ error: 'Bad Request', error_message: `Слот ${to} недоступен для этого инвентаря` });
    }

    if (!inventory.items.some(item => item.slot === from)) {
      // мб не будет работать)) надо проверить будет потом
      console.warn(`Слот ${from} (from) пустой, инвентарь: (${inventory.type}) ${inventoryId}`);
      return res.status(400).json({ error: 'Bad Request', error_message: `Слот ${from} пустой` });
    }

    switch (inventory.items.length) {
      case 0:
        return res.status(400).json({ error: 'Bad Request', error_message: `Слот ${from} пустой` });
      case 1:
        await prisma.inventoryItems.update({ where: { key: { inventoryId, slot: from } }, data: { slot: to } });
        break;
      case 2:
        if ((inventory.items[0].itemId === inventory.items[1].itemId) && (inventory.items[1].count < inventory.items[1].item!.max_stack_size)) {
          // Если это одинаковые предметы, и в слоте, в который хотят переместить есть место
          const [first, second] = resolveStackItem(inventory.items[0].item!.max_stack_size, [inventory.items[0].count, inventory.items[1].count]);

          if (second === 0) {
            await prisma.$transaction([
              prisma.inventoryItems.delete({ where: { key: { inventoryId, slot: from } } }),
              prisma.inventoryItems.update({ where: { key: { inventoryId, slot: to } }, data: { count: first } })
            ]);
          } else {
            await prisma.$transaction([
              prisma.inventoryItems.update({ where: { key: { inventoryId, slot: to } }, data: { slot: 9999, count: second } }),
              prisma.inventoryItems.update({ where: { key: { inventoryId, slot: from } }, data: { slot: to, count: first } }),
              prisma.inventoryItems.update({ where: { key: { inventoryId, slot: 9999 } }, data: { slot: from } })
            ]);
          }
        } else {

          await prisma.$transaction([
            prisma.inventoryItems.update({ where: { key: { inventoryId, slot: to } }, data: { slot: 9999 } }), // Такое чтобы избежать ошибки с UNIQUE
            prisma.inventoryItems.update({ where: { key: { inventoryId, slot: from } }, data: { slot: to } }),
            prisma.inventoryItems.update({ where: { key: { inventoryId, slot: 9999 } }, data: { slot: from } })
          ]);
        }
        break;
    }

    res.json({ success: true });
  }
}

export default new InventoryController();