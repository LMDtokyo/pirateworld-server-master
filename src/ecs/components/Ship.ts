// src/ecs/components/Ship.ts

export const Ship = 'Ship';

export interface ShipComponent {
    name: string;
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    maneuverability: number;   // 🆕 шанс увернуться от атаки
    luck: number;              // 🆕 шанс крита и дополнительного лута
    repairSpeed: number;       // 🆕 скорость восстановления корабля
}
