// src/ecs/components/Inventory.ts

export const Inventory = 'Inventory';

export interface InventoryItem {
    itemId: string;
    count: number;
}

export interface InventoryComponent {
    items: InventoryItem[];
}
