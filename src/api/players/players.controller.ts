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

class PlayersController {
  async player(req: Request<{ id: string }, null, null, { include?: string[] }>, res: Response) {
    const id = Number(req.params.id);

    if (id !== req.jwt.id) {
      return res.status(403).json({ error: 'Access Denied', error_message: 'Нет доступа' });
    }

    const { include = [] } = req.query;

    const player = await prisma.user.findFirst({
      where: { id: +req.params.id },
      select: {
        login: true,
        id: true,
        avatar_hash: true,
        lvl: true,
        hp: true,
        exp: include.includes('exp'),
        resources: include.includes('resources') ? { select: ResourcesSelectedValues } : false,
        inventory: include.includes('inventoryId') ? { select: { id: include.includes('inventoryId') } } : false
      }
    });

    if (!player) {
      return res.status(404).json({ error: 'Not Found', error_message: `Игрок с ID ${req.params.id} не найден` });
    }

    res.json({
      ...player,
      avatar: process.env.API_URL + `/public/avatars/${player.avatar_hash}.png`,
      inventoryId: player.inventory?.id,
      avatar_hash: undefined,
      inventory: undefined
    });
  }
}

export default new PlayersController();
