import { Request, Response } from 'express';
import prisma from '../../database/index.js';

const ResourcesSelectedValues = {
  real: true,
  doubloon: true,
  wood: true,
  sugar: true,
  rum: true,
  clotch: true,
  iron: true,
  crystal: true
};

// Функция расчета максимального ХП по уровню
function calculateMaxHp(level: number): number {
  return 300 + (level - 1) * 20;
}

// Функция расчета максимального опыта по уровню
function calculateMaxExp(level: number): number {
  return level * 1000;
}

class PlayersController {
  async player(req: Request<{ id: string }, null, null, { include?: string[] }>, res: Response) {
    const id = Number(req.params.id);

    if (id !== req.jwt.id) {
      return res.status(403).json({ error: 'Access Denied', error_message: 'Нет доступа' });
    }

    const { include = [] } = req.query;

    const player = await prisma.user.findFirst({
      where: { id: id },
      select: {
        login: true,
        id: true,
        avatar_hash: true,
        lvl: true,
        hp: true,
        exp: include.includes('exp'),
        resources: include.includes('resources') ? { select: ResourcesSelectedValues } : false,
        inventory: include.includes('inventoryId') ? { select: { id: true } } : false
      }
    });

    if (!player) {
      return res.status(404).json({ error: 'Not Found', error_message: `Игрок с ID ${req.params.id} не найден` });
    }

    res.json({
      id: player.id,
      login: player.login,
      avatar: player.avatar_hash
          ? `${process.env.API_URL}/public/avatars/${player.avatar_hash}.png`
          : null,
      lvl: player.lvl,
      hp: player.hp,
      maxHp: calculateMaxHp(player.lvl),
      exp: include.includes('exp') ? player.exp : undefined,
      maxExp: include.includes('exp') ? calculateMaxExp(player.lvl) : undefined,
      resources: player.resources || undefined,
      inventoryId: player.inventory?.id || undefined
    });
  }
}

export default new PlayersController();
