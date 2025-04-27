// src/ecs/components/Luck.ts

export const Luck = 'Luck';

export interface LuckComponent {
    criticalChance: number; // шанс крита (%)
    lootBonusChance: number; // шанс получить больше лута (%)
}
