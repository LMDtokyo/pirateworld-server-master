// src/ecs/systems/CooldownSystem.ts

import { EntityManager } from '../core/EntityManager.js';
import {
    Cooldown, CooldownComponent,
    Inventory, InventoryComponent,
    PassiveSet, PassiveSetComponent
} from '../components/index.js';

type AttackType = 'basic' | 'harpoon' | 'mortar' | 'fireball';

const BASE_COOLDOWNS: Record<AttackType, number> = {
    basic: 1000,       // 1 сек
    harpoon: 30000,    // 30 сек
    mortar: 120000,    // 120 сек
    fireball: 30000,   // 30 сек
};

const RESOURCE_REQUIREMENTS: Record<AttackType, string | null> = {
    basic: null,
    harpoon: 'HarpoonCharge', // itemId в инвентаре
    mortar: 'MortarCharge',
    fireball: 'FireballCharge',
};

export class CooldownSystem {
    constructor(private em: EntityManager) {}

    canAttack(entityId: number, attackType: AttackType): boolean {
        const cooldown = this.em.getComponent<CooldownComponent>(entityId, Cooldown);
        const now = Date.now();

        const passiveSet = this.em.getComponent<PassiveSetComponent>(entityId, PassiveSet);
        const inventory = this.em.getComponent<InventoryComponent>(entityId, Inventory);

        let baseCooldown = BASE_COOLDOWNS[attackType];

        // 1. Применяем пассивки на снижение КД
        if (attackType === 'harpoon' && passiveSet) {
            const harpoonReduction = passiveSet.passives.reduce((sum: number, p: PassiveSkill) => sum + (p.bonusHarpoonCd || 0), 0);
            baseCooldown *= (1 - harpoonReduction / 100);
        }
        if (attackType === 'mortar' && passiveSet) {
            const mortarReduction = passiveSet.passives.reduce((sum: number, p: PassiveSkill) => sum + (p.bonusMortarCd || 0), 0);
            baseCooldown *= (1 - mortarReduction / 100);
        }

        const lastAttackTime = cooldown?.attackCooldown || 0;
        if (now - lastAttackTime < baseCooldown) {
            return false; // кд не прошёл
        }

        // 2. Проверяем наличие зарядов если нужно
        const requiredResource = RESOURCE_REQUIREMENTS[attackType];
        if (requiredResource && inventory) {
            const hasCharge = inventory.items.some((item: InventoryItem) => item.itemId === requiredResource && item.count > 0);
            if (!hasCharge) {
                return false; // нет зарядов
            }
        }

        return true;
    }

    useAttack(entityId: number, attackType: AttackType) {
        const now = Date.now();

        const inventory = this.em.getComponent<InventoryComponent>(entityId, Inventory);

        // 1. Если требуется заряд — тратим
        const requiredResource = RESOURCE_REQUIREMENTS[attackType];
        if (requiredResource && inventory) {
            const item = inventory.items.find((i: InventoryItem) => i.itemId === requiredResource);
            if (item && item.count > 0) {
                item.count -= 1;
            }
        }

        // 2. Обновляем кулдаун
        this.em.addComponent(entityId, Cooldown, { attackCooldown: now });
    }
}

// Нужно определить типы PassiveSkill и InventoryItem:
interface PassiveSkill {
    passiveId: number;
    bonusResourceDrop: number;
    bonusHarpoonCd: number;
    bonusMortarCd: number;
}

interface InventoryItem {
    itemId: string;
    count: number;
}
