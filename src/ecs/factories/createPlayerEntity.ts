// src/ecs/factories/createPlayerEntity.ts

import prisma from '../../database/index.js';
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
    TalentSet, TalentSetComponent,
    PassiveSet, PassiveSetComponent,
    BattleLog, BattleLogComponent,
    Player, PlayerComponent,
    Ship, ShipComponent
} from '../components/index.js';

export async function createPlayerEntity(em: EntityManager, userId: number): Promise<number> {
    // Загружаем данные пользователя, включая корабль, экипировку, экипаж корабля, навыки, таланты, пассивки и инвентарь
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            ship: {
                include: {
                    equipment: true, // Массив ShipEquipment
                    crew: true       // Массив ShipCrew
                }
            },
            userEquipment: { include: { item: true } },
            userSkills: { include: { skill: true } },
            userTalents: { include: { talent: true } },
            userPassiveSkills: { include: { passiveSkill: true } },
            inventory: { include: { items: { include: { item: true } } } },
        },
    });

    if (!user || !user.ship) {
        throw new Error('Пользователь или его корабль не найдены.');
    }

    // Базовые статы (пользователь + базовые статы корабля)
    let totalAttack = user.attack + user.ship.attack;
    let totalDefense = user.defense + user.ship.defense;
    let totalSpeed = user.speed + user.ship.speed;
    let totalLuck = user.luck + user.ship.luck;
    let totalManeuverability = user.maneuverability + user.ship.maneuverability;
    let totalRepairSpeed = user.repairSpeed + user.ship.repairSpeed;

    // Здоровье и мана (максимальные значения)
    let maxHp = user.hp + user.ship.hp;
    let maxMana = user.mana + user.ship.mana;

    // ⚓ Учёт экипировки КОРАБЛЯ (ShipEquipment)
    // (bonusAttack, bonusSpeed, bonusDefense, bonusDamage и т.д.)
    if (user.ship.equipment && user.ship.equipment.length > 0) {
        for (const eq of user.ship.equipment) {
            totalAttack += eq.bonusAttack;
            totalDefense += eq.bonusDefense;
            totalSpeed += eq.bonusSpeed;
            // eq.bonusDamage — добавляйте, если нужно
        }
    }

    // ⚓ Учёт экипажа КОРАБЛЯ (ShipCrew)
    // (bonusHp, bonusAttack, bonusSpeed, bonusDefense, bonusLuck, bonusRepairSpeed)
    if (user.ship.crew && user.ship.crew.length > 0) {
        for (const crewMember of user.ship.crew) {
            maxHp += crewMember.bonusHp;
            totalAttack += crewMember.bonusAttack;
            totalDefense += crewMember.bonusDefense;
            totalSpeed += crewMember.bonusSpeed;
            totalLuck += crewMember.bonusLuck;
            totalRepairSpeed += crewMember.bonusRepairSpeed;
        }
    }

    // Бонусы от экипированных предметов у пользователя (UserEquipment)
    for (const equip of user.userEquipment) {
        totalAttack += equip.item?.bonusAttack || 0;
        totalDefense += equip.item?.bonusDefense || 0;
        totalSpeed += equip.item?.bonusSpeed || 0;
        totalLuck += equip.item?.bonusLuck || 0;
        totalManeuverability += equip.item?.bonusManeuverability || 0;
        totalRepairSpeed += equip.item?.bonusRepairSpeed || 0;
    }

    // Формируем сет талантов (userTalents)
    const talents: TalentSetComponent = {
        talents: user.userTalents.map((t) => ({
            talentId: t.talent.id,
            bonusAttack: t.talent.bonusAttack,
            bonusDefense: t.talent.bonusDefense,
            bonusSpeed: t.talent.bonusSpeed,
            bonusLuck: t.talent.bonusLuck,
            bonusMana: t.talent.bonusMana,
        })),
    };

    // Добавляем бонусы талантов
    for (const t of talents.talents) {
        totalAttack += t.bonusAttack;
        totalDefense += t.bonusDefense;
        totalSpeed += t.bonusSpeed;
        totalLuck += t.bonusLuck;
        maxMana += t.bonusMana;
    }

    // Формируем сет пассивок (userPassiveSkills)
    const passives: PassiveSetComponent = {
        passives: user.userPassiveSkills.map((p) => ({
            passiveId: p.passiveSkill.id,
            bonusResourceDrop: p.passiveSkill.bonusResourceDrop,
            bonusHarpoonCd: p.passiveSkill.bonusHarpoonCd,
            bonusMortarCd: p.passiveSkill.bonusMortarCd,
        })),
    };

    // Формируем инвентарь
    const inventory: InventoryComponent = {
        items: user.inventory?.items
            .filter((i) => i.itemId !== null)
            .map((i) => ({
                itemId: i.itemId!,
                count: i.count,
            })) || [],
    };

    // Формируем список умений (userSkills)
    const skills: SkillSetComponent = {
        skills: user.userSkills.map((s) => ({
            skillId: s.skill!.id,
            cooldown: s.skill!.cooldown,
            level: s.level,
        })),
    };

    // Создаем новую сущность игрока в ECS
    const entityId = em.createEntity();

    // Добавляем компоненты ECS
    em.addComponent(entityId, Health, {
        current: maxHp,
        max: maxHp,
    } as HealthComponent);

    em.addComponent(entityId, Mana, {
        current: maxMana,
        max: maxMana,
    } as ManaComponent);

    em.addComponent(entityId, Attack, {
        value: totalAttack,
    } as AttackComponent);

    em.addComponent(entityId, Defense, {
        value: totalDefense,
    } as DefenseComponent);

    em.addComponent(entityId, Speed, {
        value: totalSpeed,
    } as SpeedComponent);

    em.addComponent(entityId, Luck, {
        criticalChance: totalLuck,
        lootBonusChance: totalLuck,
    } as LuckComponent);

    em.addComponent(entityId, Maneuverability, {
        dodgeChance: totalManeuverability,
    } as ManeuverabilityComponent);

    em.addComponent(entityId, RepairSpeed, {
        value: totalRepairSpeed,
    } as RepairSpeedComponent);

    em.addComponent(entityId, Inventory, inventory);
    em.addComponent(entityId, SkillSet, skills);
    em.addComponent(entityId, TalentSet, talents);
    em.addComponent(entityId, PassiveSet, passives);

    em.addComponent(entityId, BattleLog, {
        actions: [],
    } as BattleLogComponent);

    em.addComponent(entityId, Player, {
        userId: user.id,
        username: user.login,
        level: user.lvl,
    } as PlayerComponent);

    // Информация о корабле (ShipComponent)
    em.addComponent(entityId, Ship, {
        name: user.ship.name,
        hp: user.ship.hp,
        mana: user.ship.mana,
        attack: user.ship.attack,
        defense: user.ship.defense,
        speed: user.ship.speed,
        maneuverability: user.ship.maneuverability,
        luck: user.ship.luck,
        repairSpeed: user.ship.repairSpeed,
    } as ShipComponent);

    return entityId;
}
