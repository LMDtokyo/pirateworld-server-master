import { Request, Response } from 'express';
import prisma from '../../database/index.js';

const allowedSortFields = [
    'lvl',
    'exp',
    'attack',
    'defense',
    'speed',
    'luck',
    'maneuverability',
    'repairSpeed',
    'shipLevel',
    'shipAttack',
    'shipDefense',
    'shipSpeed',
    'totalPower'
];

class TopController {
    async getTopPlayers(req: Request, res: Response) {
        try {
            const sortBy = req.query.sortBy as string || 'lvl';

            if (!allowedSortFields.includes(sortBy)) {
                return res.status(400).json({ error: 'Bad Request', error_message: 'Недопустимое поле сортировки' });
            }

            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    login: true,
                    lvl: true,
                    exp: true,
                    attack: true,
                    defense: true,
                    speed: true,
                    luck: true,
                    maneuverability: true,
                    repairSpeed: true,
                    Ship: {
                        select: {
                            level: true,
                            attack: true,
                            defense: true,
                            speed: true
                        }
                    }
                }
            });

            const players = users.map(u => {
                const characterPower = u.attack + u.defense + u.speed;
                const shipPower = (u.Ship?.attack || 0) + (u.Ship?.defense || 0) + (u.Ship?.speed || 0);
                return {
                    id: u.id,
                    login: u.login,
                    lvl: u.lvl,
                    exp: u.exp,
                    attack: u.attack,
                    defense: u.defense,
                    speed: u.speed,
                    luck: u.luck,
                    maneuverability: u.maneuverability,
                    repairSpeed: u.repairSpeed,
                    shipLevel: u.Ship?.level || 0,
                    shipAttack: u.Ship?.attack || 0,
                    shipDefense: u.Ship?.defense || 0,
                    shipSpeed: u.Ship?.speed || 0,
                    totalPower: characterPower + shipPower
                };
            });

            const sortedPlayers = players.sort((a, b) => {
                return (b[sortBy] || 0) - (a[sortBy] || 0);
            });

            res.json({ success: true, top: sortedPlayers });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Error', error_message: 'Не удалось получить топ игроков' });
        }
    }
}

export default new TopController();
