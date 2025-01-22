const prisma = require("../../../src/application/database");

const permitCategorySeed = async () => {
  await prisma.permitCategory.createMany({
    data: [
      { name: "Eksplorasi" },
      { name: "Operasi Produksi" },
      { name: "Pengangkutan dan Penjualan" },
      { name: "Pengelolaan Limbah B3" },
      { name: "AMDAL" },
      { name: "IPPKH" },
      { name: "Izin Pengelolaan Air" },
      { name: "Sertifikasi Keselamatan Operasional Tambang" },
      { name: "Izin Infrastruktur Tambang" },
      { name: "Izin Pembangunan Pelabuhan atau Dermaga" },
      { name: "Izin Pemasangan Alat Berat" },
      { name: "Izin Ventilasi Tambang Bawah Tanah" },
      { name: "Izin Pengangkutan Batu Bara" },
      { name: "Perjanjian Komunitas" },
      { name: "Sertifikasi ISO" },
    ],
  });
  console.log("Permit category seed completed");
};

module.exports = permitCategorySeed;
