// src/ecs/factories/createBotEntity.ts

import prisma from '../../database/index.js'; // относительный импорт к базе
import { EntityManager } from '../core/EntityManager.js';
import {
    Health, HealthComponent,
    Attack, AttackComponent,
    Defense, DefenseComponent,
    Speed, SpeedComponent,
    Mana, ManaComponent,
    Luck, LuckComponent,
    Maneuverability, ManeuverabilityComponent,
    RepairSpeed, RepairSpeedComponent,
    Inventory, InventoryComponent,
    SkillSet, SkillSetComponent,
    BattleLog, BattleLogComponent,
    BotType, BotTypeComponent,
    Ship, ShipComponent,
} from '../components/index.js'; // импорт всех компонентов через index.js


type BotSpawnType = 'simple' | 'trader' | 'caravan' | 'hunter';

interface CreateBotEntityOptions {
    botType: BotSpawnType;
    botId?: number; // если есть ID из базы, иначе создаём шаблонного
}

export async function createBotEntity(em: EntityManager, options: CreateBotEntityOptions): Promise<number> {
    const { botType, botId } = options;

    let botStats: {
        name: string;
        health: number;
        mana: number;
        attack: number;
        defense: number;
        speed: number;
        maneuverability: number;
        luck: number;
        repairSpeed: number;
        skills: { skillId: number; cooldown: number; level: number }[];
    };

    if (botId) {
        // 1. Бот берётся из базы
        const bot = await prisma.bot.findUnique({
            where: { id: botId },
            include: { skills: { include: { skill: true } } },
        });

        if (!bot) {
            throw new Error('Bot not found');
        }

        botStats = {
            name: bot.name,
            health: bot.health,
            mana: bot.mana,
            attack: 30 + bot.level * 5,
            defense: 10 + bot.level * 2,
            speed: 5 + bot.level,
            maneuverability: 5,
            luck: 5,
            repairSpeed: 0,
            skills: bot.skills.map(bs => ({
                skillId: bs.skillId,
                cooldown: bs.skill.cooldown,
                level: bs.level,
            })),
        };
    } else {
        // 2. Генерация шаблонного бота
        switch (botType) {
            case 'simple':
                botStats = {
                    name: 'Simple Pirate',
                    health: 500,
                    mana: 50,
                    attack: 50,
                    defense: 20,
                    speed: 10,
                    maneuverability: 5,
                    luck: 5,
                    repairSpeed: 2,
                    skills: [],
                };
                break;
            case 'trader':
                botStats = {
                    name: 'Merchant Ship',
                    health: 1000,
                    mana: 100,
                    attack: 20,
                    defense: 40,
                    speed: 8,
                    maneuverability: 3,
                    luck: 15,
                    repairSpeed: 5,
                    skills: [],
                };
                break;
            case 'caravan':
                botStats = {
                    name: 'Trade Caravan',
                    health: 2000,
                    mana: 200,
                    attack: 40,
                    defense: 60,
                    speed: 6,
                    maneuverability: 2,
                    luck: 20,
                    repairSpeed: 8,
                    skills: [],
                };
                break;
            case 'hunter':
                botStats = {
                    name: 'Pirate Hunter',
                    health: 800,
                    mana: 100,
                    attack: 100,
                    defense: 50,
                    speed: 12,
                    maneuverability: 10,
                    luck: 10,
                    repairSpeed: 5,
                    skills: [],
                };
                break;
            default:
                throw new Error(`Unknown botType: ${botType}`);
        }
    }

    // 3. Создаём сущность
    const entityId = em.createEntity();

    // 4. Назначаем компоненты
    em.addComponent(entityId, Health, { current: botStats.health, max: botStats.health } as HealthComponent);
    em.addComponent(entityId, Mana, { current: botStats.mana, max: botStats.mana } as ManaComponent);
    em.addComponent(entityId, Attack, { value: botStats.attack } as AttackComponent);
    em.addComponent(entityId, Defense, { value: botStats.defense } as DefenseComponent);
    em.addComponent(entityId, Speed, { value: botStats.speed } as SpeedComponent);
    em.addComponent(entityId, Luck, {
        criticalChance: botStats.luck,
        lootBonusChance: botStats.luck,
    } as LuckComponent);
    em.addComponent(entityId, Maneuverability, {
        dodgeChance: botStats.maneuverability,
    } as ManeuverabilityComponent);
    em.addComponent(entityId, RepairSpeed, {
        value: botStats.repairSpeed,
    } as RepairSpeedComponent);
    em.addComponent(entityId, BattleLog, { actions: [] } as BattleLogComponent);
    em.addComponent(entityId, BotType, { type: botType } as BotTypeComponent);

    if (botStats.skills.length > 0) {
        em.addComponent(entityId, SkillSet, { skills: botStats.skills } as SkillSetComponent);
    }

    // Можно при желании добавить ещё компонент Inventory, если торговец с товаром.

    return entityId;
}
