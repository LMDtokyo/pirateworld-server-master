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
] as const;

type SortField = typeof allowedSortFields[number];

interface Player {
    id: number;
    login: string;
    lvl: number;
    exp: number;
    attack: number;
    defense: number;
    speed: number;
    luck: number;
    maneuverability: number;
    repairSpeed: number;
    shipLevel: number;
    shipAttack: number;
    shipDefense: number;
    shipSpeed: number;
    totalPower: number;
    [key: string]: number | string; // Для доступа через sortBy
}

class TopController {
    async getTopPlayers(req: Request, res: Response) {
        try {
            const sortBy = (req.query.sortBy as SortField) || 'lvl';

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

            const players: Player[] = users.map(u => {
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
                const aValue = typeof a[sortBy] === 'number' ? (a[sortBy] as number) : 0;
                const bValue = typeof b[sortBy] === 'number' ? (b[sortBy] as number) : 0;
                return bValue - aValue;
            });

            res.json({ success: true, top: sortedPlayers });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Error', error_message: 'Не удалось получить топ игроков' });
        }
    }
}

export default new TopController();
