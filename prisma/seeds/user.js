import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const users = [
  {
    login: 'admin',
    password: bcrypt.hashSync('admin', 7),
    email: 'admin@admin.com',
    avatar_hash: 'LCJleHAiOjE2ODM5ODQzNjR9',
    lvl: 1,
    hp: 300,
    exp: 0,
    mana: 0
  }
]

const main = async () => {
  console.log(`🌴 Start seeding users table.`)

  // Удаляем всё старое (по зависимостям)
  await prisma.refreshToken.deleteMany()
  await prisma.inventory.deleteMany()
  await prisma.userResources.deleteMany()
  await prisma.userSkill.deleteMany()
  await prisma.user.deleteMany()

  for (const user of users) {
    const createdSkill = await prisma.userSkill.create({
      data: {
        skill_points: 0 // или что тебе нужно по умолчанию
      }
    })

    await prisma.user.create({
      data: {
        ...user,
        userSkill: {
          connect: { id: createdSkill.id }
        },
        resources: {
          create: {}
        },
        inventory: {
          create: { type: 'Player' }
        }
      }
    })
  }

  console.log(`🌴 ${users.length} users created with inventory, resources, and skill.`)
}

main()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })
