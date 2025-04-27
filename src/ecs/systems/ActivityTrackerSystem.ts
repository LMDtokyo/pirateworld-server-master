// src/ecs/systems/ActivityTrackerSystem.ts

import { EntityManager } from '../core/EntityManager.js';
import { BattleManager } from '../battle/locations/BattleManager.js';
import { TargetPlayer, TargetPlayerComponent } from '../components/index.js';

const ACTIVITY_THRESHOLD = 5; // Сколько действий до спавна охотника
const COOLDOWN_AFTER_SPAWN = 10 * 60 * 1000; // 10 минут защиты от нового охотника

interface PlayerActivity {
    actions: number;
    lastHunterSpawn: number;
}

export class ActivityTrackerSystem {
    private playerActivity: Map<number, PlayerActivity> = new Map();

    constructor(private em: EntityManager, private battle: BattleManager) {}

    registerPlayerAction(playerId: number) {
        const now = Date.now();
        const activity = this.playerActivity.get(playerId) || { actions: 0, lastHunterSpawn: 0 };
        activity.actions += 1;

        const timeSinceLastHunter = now - activity.lastHunterSpawn;

        if (activity.actions >= ACTIVITY_THRESHOLD && timeSinceLastHunter > COOLDOWN_AFTER_SPAWN) {
            // Спавним охотника
            this.spawnHunterForPlayer(playerId);
            activity.actions = 0; // сброс активности
            activity.lastHunterSpawn = now;
        }

        this.playerActivity.set(playerId, activity);
    }

    private async spawnHunterForPlayer(playerId: number) {
        console.log(`[ActivityTrackerSystem] Игрок ${playerId} стал целью охотника!`);

        const hunterId = await this.battle.addBot('hunter');

        // Назначаем цель охотнику
        this.battle.em.addComponent(hunterId, TargetPlayer, {
            playerId: playerId,
        } as TargetPlayerComponent);
    }
}
