const prisma = require("../../../src/application/database");

const institutionSeed = async () => {
  await prisma.institution.createMany({
    data: [
      { name: "ESDM" },
      { name: "KLHK" },
      { name: "Kemenhub" },
      { name: "PUPR" },
      { name: "Kominfo" },
      { name: "BPLHD" },
      { name: "BSN" },
      { name: "DJP" },
      { name: "POLRI" },
      { name: "Disnaker" },
      { name: "Dinas ESDM Provinsi" },
    ],
  });
  console.log("Institution seed completed");
};

module.exports = institutionSeed;
