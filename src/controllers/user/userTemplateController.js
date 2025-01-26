const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const prisma = require("@prisma/client").PrismaClient;
const prismaClient = new prisma();

module.exports = {
  // Fungsi untuk membuat template Excel
  createUserTemplate: async (req, res, next) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("User Template");

      // Define columns
      worksheet.columns = [
        { header: "Name", key: "name", width: 20 },
        { header: "Email", key: "email", width: 30 },
        { header: "Password", key: "password", width: 20 },
        { header: "Role", key: "role", width: 15 },
        { header: "Department ID", key: "departmentId", width: 15 },
      ];

      // Style header row
      worksheet.getRow(1).font = { bold: true };

      // Tentukan lokasi penyimpanan sementara
      const filePath = path.join(
        __dirname,
        "../templates",
        "user_template.xlsx"
      );

      // Simpan file Excel
      await workbook.xlsx.writeFile(filePath);

      // Kirim file ke user
      res.download(filePath, "user_template.xlsx", () => {
        // Hapus file setelah dikirim
        fs.unlinkSync(filePath);
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating template",
        error: error.message,
      });
    }
  },

  // Fungsi untuk membaca file Excel dan registrasi user
  registerUsersFromExcel: async (req, res) => {
    try {
      const filePath = req.file.path; // Path dari file yang diunggah
      const workbook = new ExcelJS.Workbook();

      // Baca file Excel
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.getWorksheet(1); // Sheet pertama

      const users = [];

      // Iterasi tiap baris untuk mengambil data
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row

        const [name, email, password, role, departmentId] = row.values.slice(1); // Ambil data dari kolom
        users.push({ name, email, password, role, departmentId });
      });

      // Simpan data user ke database
      const createdUsers = await prismaClient.user.createMany({
        data: users,
        skipDuplicates: true, // Skip email yang duplikat
      });

      // Hapus file sementara
      fs.unlinkSync(filePath);

      res.status(200).json({
        success: true,
        message: `${createdUsers.count} users registered successfully!`,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error registering users",
        error: error.message,
      });
    }
  },
};
