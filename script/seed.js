const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  await Promise.all([
    await prisma.users.create({
      data: {
        email: "admin@gmail.com",
        password: "admin",
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
