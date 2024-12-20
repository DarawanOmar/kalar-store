const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  await Promise.all([
    await prisma.products.create({
      data: {
        name: "Product 1",
        price: 100,
        quantity: 10,
        description: "Product 1 Description",
        createdAt: new Date(),
        updatedAt: new Date(),
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
