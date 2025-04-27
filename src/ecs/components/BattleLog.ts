// src/ecs/components/BattleLog.ts

export const BattleLog = 'BattleLog';

export interface BattleLogComponent {
    actions: string[]; // простая история боевых действий
}
