// src/ecs/helpers/StatCalculator.ts

export interface AttackParams {
    attackerAttack: number;
    attackerSpeed: number;
    attackerLuck: number;
}

export interface DefenseParams {
    defenderDefense: number;
    defenderManeuverability: number;
}

export interface RegenParams {
    regenStat: number; // скорость восстановления
    maxHp: number;
}

export class StatCalculator {
    /**
     * Рассчитывает реальный урон с учётом атаки, скорости, защиты, критов и уклонения
     */
    static calculateDamage(attacker: AttackParams, defender: DefenseParams): { damage: number; isCrit: boolean; isDodge: boolean } {
        // 1. Проверяем шанс уворота
        const dodgeChance = Math.min(defender.defenderManeuverability, 60); // макс 60%
        const dodgeRoll = Math.random() * 100;
        if (dodgeRoll < dodgeChance) {
            return { damage: 0, isCrit: false, isDodge: true };
        }

        // 2. Бонус урона от скорости
        const speedBonus = Math.min(attacker.attackerSpeed, 70) * 0.25 / 100;
        let baseDamage = attacker.attackerAttack * (1 + speedBonus);

        // 3. Критическая атака
        const critRoll = Math.random() * 100;
        let critMultiplier = 1;
        const luck = attacker.attackerLuck;

        if (critRoll < luck * 0.2) {
            critMultiplier = 5; // супер крит
        } else if (critRoll < luck * 0.5) {
            critMultiplier = 3; // средний крит
        } else if (critRoll < luck) {
            critMultiplier = 2; // обычный крит
        }

        baseDamage *= critMultiplier;

        // 4. Применяем защиту
        const defenseReduction = Math.min(defender.defenderDefense, 95); // макс 95%
        const finalDamage = Math.max(0, baseDamage * (1 - defenseReduction / 100));

        return {
            damage: Math.round(finalDamage),
            isCrit: critMultiplier > 1,
            isDodge: false,
        };
    }

    /**
     * Рассчитывает восстановление HP в секунду
     */
    static calculateRegen(regenStat: number, maxHp: number): number {
        const cappedRegen = Math.min(regenStat, 15); // макс 15%
        return Math.round((maxHp * cappedRegen) / 100);
    }
}
