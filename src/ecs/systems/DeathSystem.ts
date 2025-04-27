// src/ecs/systems/DeathSystem.ts

import { EntityManager } from '../core/EntityManager.js';
import {
    Health, HealthComponent,
    Player, PlayerComponent,
    BotType, BotTypeComponent,
    BattleLog, BattleLogComponent
} from '../components/index.js';
import prisma from '../../database/index.js';

export class DeathSystem {
    constructor(private em: EntityManager) {}

    async processDeaths() {
        const entities = this.em.getEntitiesWith(Health);

        for (const entityId of entities) {
            const health = this.em.getComponent<HealthComponent>(entityId, Health);
            if (!health || health.current > 0) continue; // живые нас не интересуют

            const isPlayer = this.em.getComponent<PlayerComponent>(entityId, Player);
            const isBot = this.em.getComponent<BotTypeComponent>(entityId, BotType);

            if (isPlayer) {
                await this.handlePlayerDeath(entityId);
            } else if (isBot) {
                this.handleBotDeath(entityId);
            }
        }
    }

    private async handlePlayerDeath(playerId: number) {
        const playerComp = this.em.getComponent<PlayerComponent>(playerId, Player);
        const battleLog = this.em.getComponent<BattleLogComponent>(playerId, BattleLog);

        if (!playerComp) return;

        // Потеря 20% золота
        const lostGoldPercent = 20;

        const userResources = await prisma.userResources.findUnique({
            where: { userId: playerComp.userId },
        });

        if (userResources) {
            const lostGold = Math.floor(userResources.real * (lostGoldPercent / 100));

            await prisma.userResources.update({
                where: { userId: playerComp.userId },
                data: { real: { decrement: lostGold } },
            });

            battleLog?.actions.push(`Вы погибли и потеряли ${lostGold} золота.`);

            console.log(`[DeathSystem] Игрок ${playerComp.userId} погиб и потерял ${lostGold} золота.`);
        }

        // Респаун: восстанавливаем здоровье на 30% от максимального
        const health = this.em.getComponent<HealthComponent>(playerId, Health);
        if (health) {
            health.current = Math.floor(health.max * 0.3);
            this.em.addComponent(playerId, Health, health);

            battleLog?.actions.push('Вы воскресли с 30% здоровья.');
        }
    }

    private handleBotDeath(botId: number) {
        console.log(`[DeathSystem] Бот ${botId} погиб.`);
        this.em.removeEntity(botId);
    }
}
