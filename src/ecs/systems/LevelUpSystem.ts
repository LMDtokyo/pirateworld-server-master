// src/ecs/systems/LevelUpSystem.ts

import { EntityManager } from '../core/EntityManager.js';
import { Player, PlayerComponent, BattleLog, BattleLogComponent } from '../components/index.js';
import prisma from '../../database/index.js';

export class LevelUpSystem {
    constructor(private em: EntityManager) {}

    async processLevelUps() {
        const players = this.em.getEntitiesWith(Player, BattleLog);

        for (const playerId of players) {
            const playerComp = this.em.getComponent<PlayerComponent>(playerId, Player);
            const battleLog = this.em.getComponent<BattleLogComponent>(playerId, BattleLog);

            if (!playerComp) continue;

            const user = await prisma.user.findUnique({
                where: { id: playerComp.userId },
            });

            if (!user) continue;

            const neededExp = user.lvl * 100;

            if (user.exp >= neededExp) {
                await prisma.user.update({
                    where: { id: playerComp.userId },
                    data: {
                        lvl: { increment: 1 },
                        exp: { decrement: neededExp },
                        skillPoints: { increment: 1 },
                    },
                });

                battleLog?.actions.push(`Вы повысили уровень! Теперь ваш уровень: ${user.lvl + 1}`);

                console.log(`[LevelUpSystem] Игрок ${playerComp.userId} поднял уровень до ${user.lvl + 1}`);
            }
        }
    }
}
