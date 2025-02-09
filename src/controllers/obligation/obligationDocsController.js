const ExcelJS = require("exceljs");
const prisma = require("../../application/database");
const { createError } = require("../../models/errorResponse");
const fs = require("fs");
const path = require("path");

module.exports = {
  downloadTemplate: async (req, res, next) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Obligation Template");

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
        { header: "Type", key: "type", width: 15 },
        { header: "Category", key: "category", width: 15 },
        { header: "Renewal (true/false)", key: "renewal", width: 30 },
        { header: "Institution Name", key: "institution", width: 25 },
        { header: "Description", key: "description", width: 30 },
        { header: "Due Date (YYYY-MM-DD)", key: "dueDate", width: 30 },
        { header: "User Names", key: "users", width: 50 },
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

      const filePath = path.join(templateDir, "obligation_template.xlsx");
      await workbook.xlsx.writeFile(filePath);

      res.download(filePath, "obligation_template.xlsx", (err) => {
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

  exportObligations: async (req, res, next) => {
    try {
      const obligations = await prisma.obligation.findMany({
        where: { deletedAt: null },
        include: {
          institution: { select: { id: true, name: true } },
          userObligations: {
            include: { user: { select: { id: true, name: true } } },
          },
        },
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Obligations");

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
        { header: "Type", key: "type", width: 15 },
        { header: "Category", key: "category", width: 15 },
        { header: "Renewal (true/false)", key: "renewal", width: 30 },
        { header: "Institution Name", key: "institution", width: 25 },
        { header: "Description", key: "description", width: 30 },
        { header: "Due Date (YYYY-MM-DD)", key: "dueDate", width: 30 },
        { header: "User Names", key: "users", width: 50 },
      ];

      worksheet.getRow(1).eachCell((cell) => {
        cell.style = headerStyle;
      });

      worksheet.columns.forEach((column) => {
        column.alignment = { horizontal: "center", vertical: "middle" };
      });

      obligations.forEach((obligation) => {
        worksheet.addRow({
          name: obligation.name,
          type: obligation.type,
          category: obligation.category,
          renewal: obligation.renewal ? "true" : "false",
          institution: obligation.institution.name,
          description: obligation.description,
          dueDate: new Date(obligation.dueDate).toISOString().split("T")[0],
          users: obligation.userObligations
            .map((uo) => uo.user.name)
            .join(", "),
        });
      });

      const templateDir = path.join(__dirname, "../../public/templates");
      if (!fs.existsSync(templateDir)) {
        fs.mkdirSync(templateDir, { recursive: true });
      }

      const filePath = path.join(templateDir, "obligation_template.xlsx");
      await workbook.xlsx.writeFile(filePath);

      res.download(filePath, "obligations.xlsx", (err) => {
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

  importObligations: async (req, res, next) => {
    try {
      if (!req.file) {
        throw createError(400, "No file uploaded");
      }

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(req.file.path);
      const worksheet = workbook.getWorksheet(1);

      let obligationsToInsert = [];

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
        const type = row.getCell(2).value
          ? row.getCell(2).value.toString().trim()
          : "";
        const category = row.getCell(3).value
          ? row.getCell(3).value.toString().trim()
          : "";
        const renewal =
          row.getCell(4).value &&
          row.getCell(4).value.toString().toLowerCase() === "true";
        const institutionName = row.getCell(5).value
          ? row.getCell(5).value.toString().trim()
          : "";
        const description = row.getCell(6).value
          ? row.getCell(6).value.toString().trim()
          : "";
        const dueDate = row.getCell(7).value
          ? new Date(row.getCell(7).value)
          : null;
        const userNames = row.getCell(8).value
          ? row
              .getCell(8)
              .value.toString()
              .split(",")
              .map((name) => name.trim())
              .filter((name) => name !== "")
          : [];

        console.log(
          name,
          type,
          category,
          renewal,
          institutionName,
          description,
          dueDate,
          userNames
        );

        if (
          !name ||
          !type ||
          !category ||
          !description ||
          !dueDate ||
          !institutionName ||
          userNames.length === 0
        ) {
          console.warn(`Skipping row ${rowNumber} due to missing data`);
          return res.status(400).json({
            success: false,
            message: `Row ${rowNumber} has missing data.`,
          });
        }

        const institution = await prisma.institution.findFirst({
          where: { name: institutionName },
          select: { id: true },
        });

        if (!institution) {
          console.warn(
            `Institution not found: ${institutionName}, skipping row ${rowNumber}`
          );
          return res.status(400).json({
            success: false,
            message: `Institution "${institutionName}" not found in row ${rowNumber}.`,
          });
        }

        const users = await prisma.user.findMany({
          where: { name: { in: userNames } },
          select: { id: true, name: true },
        });

        if (users.length !== userNames.length) {
          const foundUserNames = users.map((u) => u.name);
          const notFoundUsers = userNames.filter(
            (name) => !foundUserNames.includes(name)
          );

          console.warn(
            `Some users not found in row ${rowNumber}:`,
            notFoundUsers
          );
          return res.status(400).json({
            success: false,
            message: `Users not found in row ${rowNumber}: ${notFoundUsers.join(
              ", "
            )}`,
          });
        }

        obligationsToInsert.push({
          name,
          type,
          category,
          renewal,
          institutionId: institution.id,
          description,
          dueDate,
          users: users.map((user) => user.id),
        });
      }

      if (obligationsToInsert.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid data to insert.",
        });
      }

      await prisma.$transaction(async (prisma) => {
        for (const obligation of obligationsToInsert) {
          const newObligation = await prisma.obligation.create({
            data: {
              name: obligation.name,
              type: obligation.type,
              category: obligation.category,
              renewal: obligation.renewal,
              institutionId: obligation.institutionId,
              description: obligation.description,
              dueDate: obligation.dueDate,
              status: "PROCESS",
            },
          });

          console.log("Inserted:", newObligation);

          const userObligationData = obligation.users.map((userId) => ({
            userId,
            obligationId: newObligation.id,
          }));

          await prisma.userObligation.createMany({ data: userObligationData });
        }
      });

      fs.unlinkSync(req.file.path);

      return res.status(201).json({
        success: true,
        message: "Obligations imported successfully",
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};
