import { Request, Response } from 'express';
import prisma from '../../database/index.js';

class ProfileController {
    async getProfile(req: Request, res: Response) {
        try {
            const playerId = req.jwt.id;

            const user = await prisma.user.findUnique({
                where: { id: playerId },
                select: {
                    id: true,
                    login: true,
                    avatar_hash: true,
                    lvl: true,
                    hp: true,
                    exp: true,
                    mana: true,
                    attack: true,
                    speed: true,
                    defense: true,
                    maneuverability: true,
                    luck: true,
                    repairSpeed: true
                }
            });

            if (!user) {
                return res.status(404).json({ error: 'Not Found', error_message: 'Пользователь не найден' });
            }

            const ship = await prisma.ship.findUnique({
                where: { userId: playerId },
                select: {
                    hp: true,
                    mana: true,
                    attack: true,
                    speed: true,
                    defense: true,
                    maneuverability: true,
                    luck: true,
                    repairSpeed: true
                }
            });

            if (!ship) {
                return res.status(404).json({ error: 'Not Found', error_message: 'Корабль не найден' });
            }

            // Суммируем статы игрока + корабля
            const totalStats = {
                hp: user.hp + ship.hp,
                mana: user.mana + ship.mana,
                attack: user.attack + ship.attack,
                speed: user.speed + ship.speed,
                defense: user.defense + ship.defense,
                maneuverability: user.maneuverability + ship.maneuverability,
                luck: user.luck + ship.luck,
                repairSpeed: user.repairSpeed + ship.repairSpeed
            };

            const characterPower = user.attack + user.defense + user.speed;
            const shipPower = ship.attack + ship.defense + ship.speed;
            const totalPower = characterPower + shipPower;

            const topFields = ['lvl', 'attack', 'defense', 'speed', 'luck', 'totalPower'] as const;

            type SortableField = typeof topFields[number];

            const topAchievements: string[] = [];

            for (const field of topFields) {
                const players = await prisma.user.findMany({
                    select: {
                        id: true,
                        lvl: true,
                        attack: true,
                        defense: true,
                        speed: true,
                        luck: true,
                        Ship: {
                            select: {
                                attack: true,
                                defense: true,
                                speed: true
                            }
                        }
                    }
                });

                const playersWithTotalPower = players.map(p => {
                    const shipPower = (p.Ship?.attack || 0) + (p.Ship?.defense || 0) + (p.Ship?.speed || 0);
                    return {
                        id: p.id,
                        lvl: p.lvl,
                        attack: p.attack,
                        defense: p.defense,
                        speed: p.speed,
                        luck: p.luck,
                        totalPower: p.attack + p.defense + p.speed + shipPower
                    };
                });

                const sorted = playersWithTotalPower.sort((a, b) => (b[field as SortableField] ?? 0) - (a[field as SortableField] ?? 0));

                const top10 = sorted.slice(0, 10).map(p => p.id);

                if (top10.includes(playerId)) {
                    topAchievements.push(field);
                }
            }

            res.json({
                success: true,
                profile: {
                    id: user.id,
                    login: user.login,
                    avatar: user.avatar_hash ? `${process.env.API_URL}/public/avatars/${user.avatar_hash}.png` : null,
                    lvl: user.lvl,
                    exp: user.exp,
                    totalStats,
                    totalPower,
                    topAchievements
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Error', error_message: 'Не удалось получить профиль' });
        }
    }
}

export default new ProfileController();
