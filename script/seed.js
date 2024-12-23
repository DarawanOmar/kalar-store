const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
async function main() {
  await Promise.all([
    await prisma.users.create({
      data: {
        email: "admin@gmail.com",
        password: await bcrypt.hash("admin", 12),
        name: "Admin",
      },
    }),
  ]).then(() => {
    console.log("Data Seeded Successfully");
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(" Error While Seeding Data ", e);
    await prisma.$disconnect();
    process.exit(1);
  });
