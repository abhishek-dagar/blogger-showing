const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Clear the database
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();

  // Create an ADMIN user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
      articles: {
        create: [
          {
            title: 'Admin Article 1',
            content: 'This is an article created by the admin.',
            published: true,
          },
          {
            title: 'Admin Article 2',
            content: 'Another article by the admin.',
            published: true,
          },
        ],
      },
    },
  });

  // Create a regular USER
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.create({
    data: {
      name: 'Regular User',
      email: 'user@example.com',
      password: userPassword,
      role: 'USER',
      articles: {
        create: [
          {
            title: 'User Article 1',
            content: 'This is an article created by the regular user.',
            published: true,
          },
        ],
      },
    },
  });

  console.log({ admin, user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 