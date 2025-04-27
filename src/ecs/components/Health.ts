// src/ecs/components/Health.ts

export const Health = 'Health';

export interface HealthComponent {
    current: number;
    max: number;
}
