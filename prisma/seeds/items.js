import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const items = [
  {
    name: 'm_commanders_pendant',
    label: 'Кулон командора',
    description: '-',
    weight: 200,
    sell_price: 780,
    image: 't_commanders_pendant.png',
    max_stack_size: 1
  },
  {
    name: 'm_undead_skull',
    label: 'Череп нежити',
    description: '-',
    weight: 280,
    sell_price: 110,
    image: 't_undead_skull.png',
    max_stack_size: 1
  },
  {
    name: 'w_broken_blade',
    label: 'Сломанный клинок',
    description: '-',
    weight: 180,
    sell_price: 190,
    image: 'w_broken_blade.gif',
    max_stack_size: 1
  },
  {
    name: 'w_pirate_gun',
    label: 'Пистолет пирата',
    description: '-',
    weight: 560,
    sell_price: 1000,
    image: 't_pirate_gun.png',
    max_stack_size: 1
  },
  {
    name: 'w_upgraded_pirate_gun',
    label: 'Улучшенный пистолет пирата',
    description: '-',
    weight: 760,
    sell_price: 1170,
    image: 't_upgraded_pirate_gun.png',
    max_stack_size: 1
  },
  {
    name: 'm_base_chest',
    label: 'Простой сундук',
    description: '-',
    weight: 3200,
    sell_price: 3000,
    image: 'm_base_chest.png',
    max_stack_size: 1
  },
  {
    name: 'm_abandoned_chest',
    label: 'Заброшенный сундук',
    description: '-',
    weight: 3100,
    sell_price: 3700,
    image: 'm_abandoned_chest.png',
    max_stack_size: 1
  },
  {
    name: 'm_base_key',
    label: 'Ключ от простого сундука',
    description: '-',
    weight: 32,
    sell_price: 0,
    image: 'm_base_key.png',
    max_stack_size: 1
  },
  {
    name: 'm_abandoned_key',
    label: 'Ключ от заброшенного сундука',
    description: '-',
    weight: 32,
    sell_price: 0,
    image: 'm_abandoned_key.png',
    max_stack_size: 1
  },
  {
    name: 'm_part_treasure_map',
    label: 'Часть карты сокровищь',
    description: '-',
    weight: 12,
    sell_price: 0,
    image: 'm_part_treasure_map.png',
    max_stack_size: 10
  },
  {
    name: 'm_treasure_map',
    label: 'Карта сокровищь',
    description: '-',
    weight: 20,
    sell_price: 0,
    image: 'm_treasure_map.png',
    max_stack_size: 5
  },
  {
    name: 'm_cursed_gold_map',
    label: 'Карта проклятого золота',
    description: '-',
    weight: 20,
    sell_price: 0,
    image: 'm_cursed_gold_map.png',
    max_stack_size: 1
  },
  {
    name: 'r_nails',
    label: 'Гвозди',
    description: '-',
    weight: 1,
    sell_price: 0,
    image: 'r_nails.png',
    max_stack_size: 64
  },
  {
    name: 'r_mermaid_scales',
    label: 'Чешуя русалки',
    description: '-',
    weight: 100,
    sell_price: 0,
    image: 'r_mermaid_scales.png',
    max_stack_size: 64
  },
  {
    name: 'r_leather',
    label: 'Кожа',
    description: '-',
    weight: 700,
    sell_price: 30,
    image: 'r_leather.png',
    max_stack_size: 64
  },
  {
    name: 'r_wood',
    label: 'Дерево',
    description: '-',
    weight: 1000,
    sell_price: 10,
    image: 'r_wood.png',
    max_stack_size: 64
  },
  {
    name: 'r_thread',
    label: 'Нитки',
    description: '-',
    weight: 30,
    sell_price: 0,
    image: 'r_thread.png',
    max_stack_size: 64
  },
  {
    name: 'r_whale_leather',
    label: 'Китовая кожа',
    description: '-',
    weight: 1500,
    sell_price: 0,
    image: 'r_whale_leather.png',
    max_stack_size: 64
  }
];

const main = async () => {
  console.log(`🌴 Start seeding items with unique item types.`);

  await prisma.item.deleteMany();
  await prisma.itemType.deleteMany();

  const createdItems = [];

  for (const item of items) {
    const type = await prisma.itemType.create({
      data: {
        name: `Тип для ${item.label}`,
        color: '#ffaa00'
      }
    });

    const createdItem = await prisma.item.create({
      data: {
        ...item,
        typeId: type.id
      }
    });

    createdItems.push(createdItem);
  }

  console.log(`🌴 ${createdItems.length} items created with individual types.`);
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
