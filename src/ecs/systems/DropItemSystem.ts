// src/ecs/systems/DropItemSystem.ts

import prisma from '../../database/index.js';
import { EntityManager } from '../core/EntityManager.js';
import {
    Inventory, InventoryComponent,
    Luck, LuckComponent,
    Player, PlayerComponent,
    BattleLog, BattleLogComponent,
    BotType, BotTypeComponent,
    LastHitBy, LastHitByComponent
} from '../components/index.js';

export class DropItemSystem {
    constructor(private em: EntityManager) {}

    async tryDropItem(botId: number) {
        const lastHit = this.em.getComponent<LastHitByComponent>(botId, LastHitBy);

        if (!lastHit) {
            console.log(`[DropItemSystem] Нет информации кто убил бота ${botId}.`);
            return;
        }

        const playerId = lastHit.attackerId;
        const inventory = this.em.getComponent<InventoryComponent>(playerId, Inventory);
        const luck = this.em.getComponent<LuckComponent>(playerId, Luck);
        const playerComp = this.em.getComponent<PlayerComponent>(playerId, Player);
        const battleLog = this.em.getComponent<BattleLogComponent>(playerId, BattleLog);

        if (!inventory || !playerComp) return;

        const botTypeComp = this.em.getComponent<BotTypeComponent>(botId, BotType);
        if (!botTypeComp) return;

        const botType = botTypeComp.type;
        const playerLuck = luck?.lootBonusChance || 0;

        const items = await prisma.item.findMany({
            where: this.getItemFilterByBotType(botType),
        });

        if (items.length === 0) {
            console.log(`[DropItemSystem] Нет предметов для типа бота ${botType}.`);
            return;
        }

        const baseDropChance = 20;
        const finalDropChance = baseDropChance + playerLuck;
        const roll = Math.random() * 100;

        if (roll > finalDropChance) {
            console.log(`[DropItemSystem] Дроп не сработал (общий шанс).`);
            return;
        }

        const selectedItem = this.pickItemByRarity(items);

        if (!selectedItem) {
            console.log(`[DropItemSystem] Не удалось выбрать предмет.`);
            return;
        }

        // === Проверяем инвентарь перед добавлением ===
        const currentSlotsUsed = inventory.items.length;
        const maxSlots = 20; // пока фиксировано
        if (currentSlotsUsed >= maxSlots) {
            battleLog?.actions.push('Ваш инвентарь полон. Предмет не был получен.');
            console.log(`[DropItemSystem] Инвентарь игрока ${playerComp.userId} полон.`);
            return;
        }

        // Добавляем предмет
        const existingSlot = inventory.items.find((i: InventoryItem) => i.itemId === selectedItem.name);

        if (existingSlot) {
            existingSlot.count += 1;
        } else {
            inventory.items.push({
                itemId: selectedItem.name,
                count: 1,
            });
        }

        // BattleLog сообщение
        battleLog?.actions.push(`Вы получили предмет: ${selectedItem.label}!`);

        console.log(`[DropItemSystem] Игрок ${playerComp.userId} получил предмет: ${selectedItem.label}`);
    }

    private getItemFilterByBotType(botType: string) {
        switch (botType) {
            case 'simple':
                return { type: { name: { in: ['Wood', 'Sugar', 'Iron'] } } };
            case 'trader':
                return { type: { name: { in: ['Wood', 'Sugar', 'Iron', 'SimpleGoods'] } } };
            case 'caravan':
                return { type: { name: { in: ['RareGoods', 'Treasure'] } } };
            case 'hunter':
                return { type: { name: { in: ['CombatGear', 'EpicWeapons'] } } };
            default:
                return {};
        }
    }

    private pickItemByRarity(items: any[]): any | null {
        const rarityChances: Record<string, number> = {
            common: 70,
            rare: 25,
            epic: 5,
        };

        const total = items.reduce((sum: number, item: any) => sum + (rarityChances[item.rarity] || 0), 0);

        const random = Math.random() * total;
        let accumulator = 0;

        for (const item of items) {
            const chance = rarityChances[item.rarity] || 0;
            accumulator += chance;
            if (random <= accumulator) {
                return item;
            }
        }

        return null;
    }
}

// Определяем тип InventoryItem локально
interface InventoryItem {
    itemId: string;
    count: number;
}
