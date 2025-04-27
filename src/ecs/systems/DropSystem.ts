// src/ecs/systems/DropSystem.ts

import { EntityManager } from '../core/EntityManager.js';
import {
    Health, HealthComponent,
    BotType, BotTypeComponent,
    Player, PlayerComponent,
    Inventory, InventoryComponent,
    BattleLog, BattleLogComponent,
    LastHitBy, LastHitByComponent
} from '../components/index.js';
import prisma from '../../database/index.js';

export class DropSystem {
    constructor(private em: EntityManager) {}

    async processDrops() {
        const deadBots = this.em.getEntitiesWith(BotType, Health).filter((botId: number) => {
            const health = this.em.getComponent<HealthComponent>(botId, Health);
            return health?.current === 0;
        });

        for (const botId of deadBots) {
            const lastHit = this.em.getComponent<LastHitByComponent>(botId, LastHitBy);

            if (!lastHit) {
                console.log('[DropSystem] Нет информации кто убил бота.');
                continue;
            }

            const killerId = lastHit.attackerId;

            const playerComp = this.em.getComponent<PlayerComponent>(killerId, Player);
            if (!playerComp) {
                console.log('[DropSystem] Убийца не игрок.');
                continue;
            }

            await this.giveRewardToPlayer(killerId);

            this.em.removeEntity(botId);

            console.log(`[DropSystem] Бот ${botId} убит.`);
        }
    }

    private async giveRewardToPlayer(playerEntityId: number) {
        const playerComp = this.em.getComponent<PlayerComponent>(playerEntityId, Player);
        if (!playerComp) return;

        const inventory = this.em.getComponent<InventoryComponent>(playerEntityId, Inventory);
        const battleLog = this.em.getComponent<BattleLogComponent>(playerEntityId, BattleLog);

        if (!inventory || !battleLog) return;

        const expGain = 50;
        await prisma.user.update({
            where: { id: playerComp.userId },
            data: { exp: { increment: expGain } },
        });

        const goldGain = 100;
        await prisma.userResources.update({
            where: { userId: playerComp.userId },
            data: { real: { increment: goldGain } },
        });

        battleLog.actions.push(`Вы получили ${expGain} опыта и ${goldGain} золота за победу!`);

        console.log(`[DropSystem] Игрок ${playerComp.userId} получил ${expGain} опыта и ${goldGain} золота.`);
    }
}
