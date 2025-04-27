// src/ecs/systems/AttackSystem.ts

import { EntityManager } from '../core/EntityManager.js';
import { CooldownSystem } from './CooldownSystem.js';
import {
    Health, HealthComponent,
    Attack, AttackComponent,
    Defense, DefenseComponent,
    Luck, LuckComponent,
    Maneuverability, ManeuverabilityComponent,
    Speed, SpeedComponent,
    BattleLog, BattleLogComponent,
    LastHitBy
} from '../components/index.js';
import { StatCalculator } from '../helpers/StatCalculator.js';

type AttackType = 'basic' | 'harpoon' | 'mortar' | 'fireball';

export class AttackSystem {
    constructor(private em: EntityManager, private cooldownSystem: CooldownSystem) {}

    attack(attackerId: number, targetId: number, attackType: AttackType): boolean {
        const attackerHealth = this.em.getComponent<HealthComponent>(attackerId, Health);
        const targetHealth = this.em.getComponent<HealthComponent>(targetId, Health);

        if (!attackerHealth || attackerHealth.current <= 0) {
            console.log('[AttackSystem] Атакующий мёртв.');
            return false;
        }
        if (!targetHealth || targetHealth.current <= 0) {
            console.log('[AttackSystem] Цель уже мертва.');
            return false;
        }

        if (!this.cooldownSystem.canAttack(attackerId, attackType)) {
            console.log('[AttackSystem] Атака на кулдауне.');
            return false;
        }

        const attackStat = this.em.getComponent<AttackComponent>(attackerId, Attack);
        const defenseStat = this.em.getComponent<DefenseComponent>(targetId, Defense);
        const luckStat = this.em.getComponent<LuckComponent>(attackerId, Luck);
        const maneuverStat = this.em.getComponent<ManeuverabilityComponent>(targetId, Maneuverability);
        const speedStat = this.em.getComponent<SpeedComponent>(attackerId, Speed);

        if (!attackStat || !defenseStat) {
            console.log('[AttackSystem] Нет данных об атаке или защите.');
            return false;
        }

        // Используем StatCalculator
        const damageResult = StatCalculator.calculateDamage(
            {
                attackerAttack: attackStat.value,
                attackerSpeed: speedStat?.value || 0,
                attackerLuck: luckStat?.criticalChance || 0,
            },
            {
                defenderDefense: defenseStat.value,
                defenderManeuverability: maneuverStat?.dodgeChance || 0,
            }
        );

        if (damageResult.isDodge) {
            this.logAction(attackerId, `Промах по ${targetId}!`);
            this.cooldownSystem.useAttack(attackerId, attackType);
            console.log(`[AttackSystem] Бот/игрок увернулся от атаки.`);
            return true;
        }

        // Наносим урон
        targetHealth.current = Math.max(0, targetHealth.current - damageResult.damage);
        this.em.addComponent(targetId, Health, targetHealth);

        // Записываем последнего атакующего
        this.em.addComponent(targetId, LastHitBy, { attackerId });

        // BattleLog запись
        if (damageResult.isCrit) {
            this.logAction(attackerId, `Критический удар по ${targetId} на ${damageResult.damage} урона!`);
            console.log(`[AttackSystem] Крит! Урон: ${damageResult.damage}`);
        } else {
            this.logAction(attackerId, `Удар по ${targetId} на ${damageResult.damage} урона.`);
            console.log(`[AttackSystem] Обычный удар. Урон: ${damageResult.damage}`);
        }

        this.cooldownSystem.useAttack(attackerId, attackType);

        return true;
    }

    private logAction(entityId: number, text: string) {
        const battleLog = this.em.getComponent<BattleLogComponent>(entityId, BattleLog);
        if (battleLog) {
            battleLog.actions.push(text);
        }
    }
}
