// src/ecs/components/TalentSet.ts

export const TalentSet = 'TalentSet';

export interface Talent {
    talentId: number;
    bonusAttack: number;
    bonusDefense: number;
    bonusSpeed: number;
    bonusLuck: number;
    bonusMana: number;
}

export interface TalentSetComponent {
    talents: Talent[];
}
