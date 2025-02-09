const ExcelJS = require("exceljs");
const prisma = require("../../application/database");
const { createError } = require("../../models/errorResponse");
const fs = require("fs");
const path = require("path");
const { randomPassword } = require("secure-random-password");
const { hashPassword } = require("../../utils/hash");
const sendEmailService = require("../../utils/sendEmail");

module.exports = {
  downloadTemplate: async (req, res, next) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("User Template");

      const headerStyle = {
        font: { bold: true, color: { argb: "FFFFFFFF" } },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "4F46E5" },
        },
        alignment: { horizontal: "center", vertical: "middle" },
      };

      worksheet.columns = [
        { header: "Name", key: "name", width: 25 },
        { header: "Email", key: "email", width: 30 },
        { header: "Role", key: "role", width: 15 },
        { header: "Department Name", key: "department", width: 30 },
      ];

      worksheet.getRow(1).eachCell((cell) => {
        cell.style = headerStyle;
      });

      worksheet.columns.forEach((column) => {
        column.alignment = { horizontal: "center", vertical: "middle" };
      });

      const templateDir = path.join(__dirname, "../../public/templates");
      if (!fs.existsSync(templateDir)) {
        fs.mkdirSync(templateDir, { recursive: true });
      }

      const filePath = path.join(templateDir, "user_template.xlsx");
      await workbook.xlsx.writeFile(filePath);

      res.download(filePath, "user_template.xlsx", (err) => {
        if (err) {
          next(err);
        } else {
          fs.unlinkSync(filePath);
        }
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  exportUsers: async (req, res, next) => {
    try {
      const users = await prisma.user.findMany({
        where: { deletedAt: null },
        include: {
          auth: { select: { email: true, role: true } },
          department: { select: { name: true } },
        },
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Users");

      const headerStyle = {
        font: { bold: true, color: { argb: "FFFFFFFF" } },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "4F46E5" },
        },
        alignment: { horizontal: "center", vertical: "middle" },
      };

      worksheet.columns = [
        { header: "Name", key: "name", width: 25 },
        { header: "Email", key: "email", width: 30 },
        { header: "Role", key: "role", width: 15 },
        { header: "Department Name", key: "department", width: 30 },
      ];

      worksheet.getRow(1).eachCell((cell) => {
        cell.style = headerStyle;
      });

      worksheet.columns.forEach((column) => {
        column.alignment = { horizontal: "center", vertical: "middle" };
      });

      users.forEach((user) => {
        worksheet.addRow({
          name: user.name,
          email: user.auth.email,
          role: user.auth.role,
          department: user.department?.name || "Unknown",
        });
      });

      const exportDir = path.join(__dirname, "../../public/exports");
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }

      const filePath = path.join(exportDir, "users.xlsx");
      await workbook.xlsx.writeFile(filePath);

      res.download(filePath, "users.xlsx", (err) => {
        if (err) {
          next(err);
        } else {
          fs.unlinkSync(filePath);
        }
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  importUsers: async (req, res, next) => {
    try {
      if (!req.file) {
        throw createError(400, "No file uploaded");
      }

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(req.file.path);
      const worksheet = workbook.getWorksheet(1);

      let usersToInsert = [];

      for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
        const row = worksheet.getRow(rowNumber);
        const isEmptyRow = row.values.every(
          (cell) =>
            cell === null || cell === undefined || cell.toString().trim() === ""
        );
        if (isEmptyRow) {
          console.warn(`Skipping empty row ${rowNumber}`);
          continue;
        }

        const name = row.getCell(1).value
          ? row.getCell(1).value.toString().trim()
          : "";
        const email = row.getCell(2).value
          ? row.getCell(2).value.toString().trim()
          : "";
        const role = row.getCell(3).value
          ? row.getCell(3).value.toString().trim().toUpperCase()
          : "";
        const departmentName = row.getCell(4).value
          ? row.getCell(4).value.toString().trim()
          : "";

        if (!name || !email || !role) {
          console.warn(`Skipping row ${rowNumber} due to missing data`);
          continue;
        }

        const existingUser = await prisma.auth.findUnique({
          where: { email },
          select: { id: true },
        });

        if (existingUser) {
          console.warn(
            `User with email ${email} already exists, skipping row ${rowNumber}`
          );
          continue;
        }

        const department = await prisma.department.findFirst({
          where: { name: departmentName },
          select: { id: true },
        });

        const password = randomPassword({
          length: 12,
          characters: "alphanumeric",
        });
        const hashedPassword = await hashPassword(password);

        usersToInsert.push({
          email,
          name,
          role,
          password,
          hashedPassword,
          departmentId: department ? department.id : null,
        });
      }

      if (usersToInsert.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid data to insert.",
        });
      }

      await prisma.$transaction(async (prisma) => {
        for (const userData of usersToInsert) {
          console.log(userData);
          const authUser = await prisma.auth.create({
            data: {
              email: userData.email,
              password: userData.hashedPassword,
              reNewPassword: false,
              role: userData.role,
            },
          });

          await prisma.user.create({
            data: {
              authId: authUser.id,
              name: userData.name,
              departmentId: userData.departmentId,
            },
          });

          await sendEmailService.sendEmail("generatedPassword", {
            to: userData.email,
            name: userData.name,
            password: userData.password,
          });
        }
      });

      fs.unlinkSync(req.file.path);

      return res.status(201).json({
        success: true,
        message:
          "Users imported successfully. Please inform users to check their emails for login details.",
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};
