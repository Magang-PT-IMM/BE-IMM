const userSeed = require("./user/userSeed");
const permitCategorySeed = require("./permitCategory/permitCategorySeed");
const departmentSeed = require("./department/departmentSeed");
const institutionSeed = require("./institution/institutionSeed");

const main = async () => {
  console.log("Seeding started...");
  //   await departmentSeed();
  //   await institutionSeed();
  //   await permitCategorySeed();
  await userSeed();
  console.log("Seeding completed!");
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();
    await prisma.$disconnect();
  });
