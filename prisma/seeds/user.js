import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const users = [
  {
    login: 'admin',
    password: bcrypt.hashSync('admin', 7),
    email: 'admin@admin.com',
    avatar_hash: 'LCJleHAiOjE2ODM5ODQzNjR9',
    lvl: 1,
    hp: 300,
    exp: 0,
    email_confirmed: false,
}]


const main = async () => {
  console.log(`🌴 Start seeding items table.`);
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: users
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log(`🌴 ${users.length} items has been created.`)
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });