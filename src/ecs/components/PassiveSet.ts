// src/ecs/components/PassiveSet.ts

export const PassiveSet = 'PassiveSet';

export interface PassiveSkill {
    passiveId: number;
    bonusResourceDrop: number;
    bonusHarpoonCd: number;
    bonusMortarCd: number;
}

export interface PassiveSetComponent {
    passives: PassiveSkill[];
}
