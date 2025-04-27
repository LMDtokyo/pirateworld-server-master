// src/ecs/battle/BattleManager.ts

import { EntityManager } from '../../core/EntityManager.js';           // относительные импорты
import { SystemManager } from '../../core/SystemManager.js';
import { createPlayerEntity } from '../../factories/createPlayerEntity.js';
import { createBotEntity } from '../../factories/createBotEntity.js';

interface BattleLocationConfig {
    id: string;           // id локации
    name: string;         // название
    spawnInterval?: number; // интервал спавна ботов (мс)
    specialScript?: (battle: BattleManager) => Promise<void>; // скрипт запуска локальной логики
}

export class BattleManager {
    public em: EntityManager;
    public sm: SystemManager;
    public locationConfig: BattleLocationConfig;
    private lastSpawnTime = 0; // 🛠 убрал лишнюю аннотацию :number

    constructor(locationConfig: BattleLocationConfig) {
        this.locationConfig = locationConfig;
        this.em = new EntityManager();
        this.sm = new SystemManager();
    }

    async addPlayer(userId: number) {
        await createPlayerEntity(this.em, userId);
    }

    async addBot(botType: 'simple' | 'trader' | 'caravan' | 'hunter'): Promise<number> {
        const botId = await createBotEntity(this.em, { botType });
        return botId; // ➡️ Возвращаем ID бота
    }


    async startBattle() {
        console.log(`[BattleManager] Starting battle on location: ${this.locationConfig.name}`);
        if (this.locationConfig.specialScript) {
            await this.locationConfig.specialScript(this);
        }
    }

    update(deltaTime: number) {
        this.sm.update(deltaTime);

        const now = Date.now();

        if (this.locationConfig.spawnInterval && now - this.lastSpawnTime > this.locationConfig.spawnInterval) {
            this.spawnSimpleBot();
            this.lastSpawnTime = now;
        }
    }

    private async spawnSimpleBot() {
        console.log(`[BattleManager] Spawning simple bot on location: ${this.locationConfig.name}`);
        await this.addBot('simple');
    }

    clear() {
        this.em.clear();
        this.sm.clear();
    }
}
