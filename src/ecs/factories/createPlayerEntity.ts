// src/ecs/factories/createPlayerEntity.ts

import prisma from '../../database/index.js';
import { EntityManager } from '../core/EntityManager.js';
import {
  Health, Attack, Defense, Speed, Mana,
  Luck, Maneuverability, RepairSpeed, Inventory,
  SkillSet, TalentSet, PassiveSet, BattleLog,
  Player, Ship
} from '../components/index.js';
import { Prisma } from '@prisma/client';

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    Ship: {
      include: { equipment: true; crew: true };
    };
    UserEquipment: { include: { item: true } };
    UserSkills: { include: { skill: true } };
    UserTalent: { include: { talent: true } };
    UserPassiveSkill: { include: { passiveSkill: true } };
    inventory: { include: { items: { include: { item: true } } } };
  };
}>;

export async function createPlayerEntity(em: EntityManager, userId: number): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      Ship: { include: { equipment: true, crew: true } },
      UserEquipment: { include: { item: true } },
      UserSkills: { include: { skill: true } },
      UserTalent: { include: { talent: true } },
      UserPassiveSkill: { include: { passiveSkill: true } },
      inventory: { include: { items: { include: { item: true } } } }
    }
  }) as UserWithRelations;

  if (!user?.Ship) {
    throw new Error('Пользователь или его корабль не найдены.');
  }

  // Базовые статы
  let totalAttack = user.attack + user.Ship.attack;
  let totalDefense = user.defense + user.Ship.defense;
  let totalSpeed = user.speed + user.Ship.speed;
  let totalLuck = user.luck + user.Ship.luck;
  let totalManeuverability = user.maneuverability + user.Ship.maneuverability;
  let totalRepairSpeed = user.repairSpeed + user.Ship.repairSpeed;

  let maxHp = user.hp + user.Ship.hp;
  let maxMana = user.mana + user.Ship.mana;

  // Бонусы от корабельного оборудования
  for (const eq of user.Ship.equipment) {
    totalAttack += eq.bonusAttack;
    totalDefense += eq.bonusDefense;
    totalSpeed += eq.bonusSpeed;
  }

  // Бонусы от экипажа корабля
  for (const crew of user.Ship.crew) {
    maxHp += crew.bonusHp;
    totalAttack += crew.bonusAttack;
    totalDefense += crew.bonusDefense;
    totalSpeed += crew.bonusSpeed;
    totalLuck += crew.bonusLuck;
    totalRepairSpeed += crew.bonusRepairSpeed;
  }

  // Бонусы от экипировки игрока
  for (const equip of user.UserEquipment) {
    totalAttack += equip.item?.bonusAttack ?? 0;
    totalDefense += equip.item?.bonusDefense ?? 0;
    totalSpeed += equip.item?.bonusSpeed ?? 0;
    totalLuck += equip.item?.bonusLuck ?? 0;
    totalManeuverability += equip.item?.bonusManeuverability ?? 0;
    totalRepairSpeed += equip.item?.bonusRepairSpeed ?? 0;
  }

  // Таланты
  const talents: {
    talentId: number;
    bonusAttack: number;
    bonusDefense: number;
    bonusSpeed: number;
    bonusLuck: number;
    bonusMana: number;
  }[] = user.UserTalent.map((t) => ({
    talentId: t.talent.id,
    bonusAttack: t.talent.bonusAttack,
    bonusDefense: t.talent.bonusDefense,
    bonusSpeed: t.talent.bonusSpeed,
    bonusLuck: t.talent.bonusLuck,
    bonusMana: t.talent.bonusMana,
  }));

  for (const talent of talents) {
    totalAttack += talent.bonusAttack;
    totalDefense += talent.bonusDefense;
    totalSpeed += talent.bonusSpeed;
    totalLuck += talent.bonusLuck;
    maxMana += talent.bonusMana;
  }

  // Пассивки
  const passives: {
    passiveId: number;
    bonusResourceDrop: number;
    bonusHarpoonCd: number;
    bonusMortarCd: number;
  }[] = user.UserPassiveSkill.map((p) => ({
    passiveId: p.passiveSkill.id,
    bonusResourceDrop: p.passiveSkill.bonusResourceDrop,
    bonusHarpoonCd: p.passiveSkill.bonusHarpoonCd,
    bonusMortarCd: p.passiveSkill.bonusMortarCd,
  }));

  // Инвентарь
  const inventory: {
    itemId: string;
    count: number;
  }[] = (user.inventory?.items || []).filter((i) => i.itemId !== null).map((i) => ({
    itemId: i.itemId ?? '',
    count: i.count,
  }));

  // Умения
  const skills: {
    skillId: number;
    cooldown: number;
    level: number;
  }[] = user.UserSkills.map((s) => ({
    skillId: s.skill.id,
    cooldown: s.skill.cooldown,
    level: s.level,
  }));

  // ====== СОЗДАНИЕ СУЩНОСТИ ======

  const entityId = em.createEntity();

  em.addComponent(entityId, Health, { current: maxHp, max: maxHp });
  em.addComponent(entityId, Mana, { current: maxMana, max: maxMana });
  em.addComponent(entityId, Attack, { value: totalAttack });
  em.addComponent(entityId, Defense, { value: totalDefense });
  em.addComponent(entityId, Speed, { value: totalSpeed });
  em.addComponent(entityId, Luck, { criticalChance: totalLuck, lootBonusChance: totalLuck });
  em.addComponent(entityId, Maneuverability, { dodgeChance: totalManeuverability });
  em.addComponent(entityId, RepairSpeed, { value: totalRepairSpeed });

  em.addComponent(entityId, Inventory, { items: inventory });
  em.addComponent(entityId, SkillSet, { skills });
  em.addComponent(entityId, TalentSet, { talents });
  em.addComponent(entityId, PassiveSet, { passives });

  em.addComponent(entityId, BattleLog, { actions: [] });

  em.addComponent(entityId, Player, {
    userId: user.id,
    username: user.login,
    level: user.lvl,
  });

  em.addComponent(entityId, Ship, {
    name: user.Ship.name,
    hp: user.Ship.hp,
    mana: user.Ship.mana,
    attack: user.Ship.attack,
    defense: user.Ship.defense,
    speed: user.Ship.speed,
    maneuverability: user.Ship.maneuverability,
    luck: user.Ship.luck,
    repairSpeed: user.Ship.repairSpeed,
  });

  return entityId;
}
