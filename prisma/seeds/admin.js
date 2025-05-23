import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const users = [
    {
        login: 'admin',
        password: bcrypt.hashSync('admin123', 7),
        email: 'admin@admin.com',
        avatar_hash: 'LCJleHAiOjE2ODM5ODQzNjR9', // можно заменить на нормальное имя файла из /avatars
        lvl: 1,
        hp: 300,
        exp: 0,
        mana: 0,
        isAdmin: true // 💥 вот оно!
    }
];

const main = async () => {
    console.log('🌴 Start seeding users table.');

    // Удаляем всё старое (по зависимостям)
    await prisma.refreshToken.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.userResources.deleteMany();
    await prisma.userSkill.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.user.deleteMany();

    // Создаём базовый навык
    const baseSkill = await prisma.skill.create({
        data: {
            name: 'Пиратская стрельба',
            description: 'Увеличивает урон огнестрельного оружия',
            type_id: 'combat',
            power: 10
        }
    });

    for (const user of users) {
        const createdUser = await prisma.user.create({
            data: {
                ...user,
                resources: { create: {} },
                inventory: { create: { type: 'Player' } }
            }
        });

        await prisma.userSkill.create({
            data: {
                userId: createdUser.id,
                skillId: baseSkill.id,
                level: 1
            }
        });
    }

    console.log(`🌴 ${users.length} user(s) created with inventory, resources, skills, and admin access.`);
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
