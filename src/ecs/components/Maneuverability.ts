// src/ecs/components/Maneuverability.ts

export const Maneuverability = 'Maneuverability';

export interface ManeuverabilityComponent {
    dodgeChance: number; // шанс уклониться от атаки (%)
}
