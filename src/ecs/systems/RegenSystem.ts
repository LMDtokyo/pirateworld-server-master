// src/ecs/systems/RegenSystem.ts

import { EntityManager } from '../core/EntityManager.js';
import { Health, HealthComponent, RepairSpeed, RepairSpeedComponent } from '../components/index.js';
import { StatCalculator } from '../helpers/StatCalculator.js';

export class RegenSystem {
    private elapsedTime = 0;

    constructor(private em: EntityManager) {}

    update(deltaTime: number) {
        this.elapsedTime += deltaTime;

        if (this.elapsedTime >= 1000) {
            this.regenerateHealth();
            this.elapsedTime = 0;
        }
    }

    private regenerateHealth() {
        const entities = this.em.getEntitiesWith(Health, RepairSpeed);

        for (const entityId of entities) {
            const health = this.em.getComponent<HealthComponent>(entityId, Health);
            const repair = this.em.getComponent<RepairSpeedComponent>(entityId, RepairSpeed);

            if (!health || !repair) continue;
            if (health.current >= health.max) continue;

            const regenAmount = StatCalculator.calculateRegen(repair.value, health.max);

            health.current = Math.min(health.current + regenAmount, health.max);

            this.em.addComponent(entityId, Health, health);

            console.log(`[RegenSystem] Сущность ${entityId} восстановила ${regenAmount} HP (текущее: ${health.current}/${health.max})`);
        }
    }
}
