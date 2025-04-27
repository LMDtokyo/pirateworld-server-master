// src/ecs/components/SkillSet.ts

export const SkillSet = 'SkillSet';

export interface Skill {
    skillId: number;
    cooldown: number;
    level: number;
}

export interface SkillSetComponent {
    skills: Skill[];
}
