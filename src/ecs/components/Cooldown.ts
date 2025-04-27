// src/ecs/components/Cooldown.ts

export const Cooldown = 'Cooldown';

export interface CooldownComponent {
    attackCooldown: number; // timestamp в миллисекундах
}
