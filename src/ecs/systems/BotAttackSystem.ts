// src/ecs/systems/BotAttackSystem.ts

import { EntityManager } from '../core/EntityManager.js';
import { AttackSystem } from './AttackSystem.js';
import { CooldownSystem } from './CooldownSystem.js';
import {
    BotType, BotTypeComponent,
    Health, HealthComponent,
    TargetPlayer, TargetPlayerComponent,
    Player, PlayerComponent
} from '../components/index.js';

export class BotAttackSystem {
    constructor(private em: EntityManager, private attackSystem: AttackSystem, private cooldownSystem: CooldownSystem) {}

    update(deltaTime: number) {
        const bots = this.em.getEntitiesWith(BotType, Health);

        for (const botId of bots) {
            const botHealth = this.em.getComponent<HealthComponent>(botId, Health);
            if (!botHealth || botHealth.current <= 0) {
                continue; // бот мертв
            }

            const botTypeComp = this.em.getComponent<BotTypeComponent>(botId, BotType);
            if (!botTypeComp) {
                continue;
            }

            const targetPlayerComp = this.em.getComponent<TargetPlayerComponent>(botId, TargetPlayer);

            // 1. Если бот — охотник и у него есть цель
            if (botTypeComp.type === 'hunter' && targetPlayerComp) {
                const playerEntityId = this.findPlayerEntityByUserId(targetPlayerComp.playerId);

                if (playerEntityId !== null) {
                    this.tryAttack(botId, playerEntityId);
                }
            }
            else {
                // 2. Простой бот — атакует ближайшего игрока
                const playerIds = this.em.getEntitiesWith(Player, Health);

                for (const playerId of playerIds) {
                    const playerHealth = this.em.getComponent<HealthComponent>(playerId, Health);
                    if (playerHealth && playerHealth.current > 0) {
                        this.tryAttack(botId, playerId);
                        break; // атакуем первого живого игрока
                    }
                }
            }
        }
    }

    private findPlayerEntityByUserId(userId: number): number | null {
        const players = this.em.getEntitiesWith(Player);
        for (const playerId of players) {
            const playerComp = this.em.getComponent<PlayerComponent>(playerId, Player);
            if (playerComp?.userId === userId) {
                return playerId;
            }
        }
        return null;
    }

    private tryAttack(botId: number, targetId: number) {
        // Бот атакует, если можно
        const canAttack = this.cooldownSystem.canAttack(botId, 'basic');
        if (canAttack) {
            console.log(`[BotAttackSystem] Бот ${botId} атакует цель ${targetId}`);
            this.attackSystem.attack(botId, targetId, 'basic');
        }
    }
}
