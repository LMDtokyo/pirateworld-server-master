// src/ecs/components/Player.ts

export const Player = 'Player';

export interface PlayerComponent {
    userId: number;
    username: string;
    level: number;
}
