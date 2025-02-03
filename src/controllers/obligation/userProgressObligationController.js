const prisma = require("../../application/database");
const { createError } = require("../../models/errorResponse");
const fs = require("fs");
const sendEmailService = require("../../utils/sendEmail");
const { formatDate } = require("../../utils/dateFormat");
const { addMonths, setDate } = require("date-fns");
const { getCCEmails } = require("../../utils/ccEmails");
const { uploadFile } = require("../../utils/uploadFiles");

module.exports = {
  createUserProgressObligation: async (req, res, next) => {
    try {
      const { id, role } = res.user;
      const { obligationId } = req.params;
      const { status, description } = req.body;

      if (!id || !obligationId) {
        throw createError(400, "User ID and Obligation ID are required");
      }
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) throw createError(404, "User not found");

      const obligation = await prisma.obligation.findUnique({
        where: { id: obligationId },
      });
      if (!obligation) throw createError(404, "Obligation not found");

      let fileUrl = "";
      if (req.file) {
        const folderId = "1bCkA-TP09QYiDOrkjRJU0d-kjK8_uo3P";
        fileUrl = await uploadFile(
          req.file.path,
          req.file.originalname,
          folderId
        );

        fs.unlinkSync(req.file.path);
      }

      await prisma.userProgressObligation.create({
        data: {
          userId: id,
          obligationId,
          status: status || "PREPARING",
          description: description || "",
          urlDocs: fileUrl,
        },
      });

      const totalUsers = await prisma.userObligation.count({
        where: { obligationId },
      });
      const verifiedUsers = await prisma.userProgressObligation.count({
        where: { obligationId, status: "VERIFICATION" },
      });
      await prisma.$transaction(async (prisma) => {
        if (role === "PIC" || role === "HEAD_DEPT") {
          if (status === "VERIFICATION") {
            if (verifiedUsers === totalUsers) {
              await prisma.obligation.update({
                where: { id: obligationId },
                data: {
                  status: "VERIFICATION",
                  latestUpdate: new Date(),
                  updatedAt: new Date(),
                },
              });
            } else {
              await prisma.obligation.update({
                where: { id: obligationId },
                data: {
                  status: obligation.status,
                  latestUpdate: new Date(),
                  updatedAt: new Date(),
                },
              });
            }
          } else {
            await prisma.obligation.update({
              where: { id: obligationId },
              data: {
                status: status,
                latestUpdate: new Date(),
                updatedAt: new Date(),
              },
            });
          }
        } else if (role === "ADMIN") {
          if (status === "COMPLETE_ON_TIME" || status === "COMPLETE_OVERDUE") {
            await prisma.obligation.update({
              where: { id: obligationId },
              data: {
                status,
                latestUpdate: new Date(),
                updatedAt: new Date(),
              },
            });
            if (obligation.renewal) {
              if (obligation.category === "MONTHLY") {
                const nextDueDate = setDate(
                  addMonths(obligation.dueDate, 1),
                  10
                );

                const newObligation = await prisma.obligation.create({
                  data: {
                    name: obligation.name,
                    type: obligation.type,
                    category: obligation.category,
                    institutionId: obligation.institutionId,
                    description: obligation.description,
                    dueDate: nextDueDate,
                    status: "PREPARING",
                    renewal: obligation.renewal,
                  },
                });
                const userObligations = await prisma.userObligation.findMany({
                  where: { obligationId },
                });

                const newUserObligations = userObligations.map((uo) => ({
                  userId: uo.userId,
                  obligationId: newObligation.id,
                }));

                await prisma.userObligation.createMany({
                  data: newUserObligations,
                });

                const obligationUsers = await prisma.userObligation.findMany({
                  where: {
                    obligationId: newObligation.id,
                  },
                  include: {
                    user: {
                      include: {
                        auth: { select: { email: true } },
                      },
                    },
                  },
                });

                const toEmails = obligationUsers.map(
                  (obligationUser) => obligationUser.user.auth.email
                );

                const users = obligationUsers.map(
                  (obligationUser) => obligationUser.user.id
                );

                const ccEmails = await getCCEmails(users);

                const findInstitution = await prisma.institution.findUnique({
                  where: { id: obligation.institutionId, deletedAt: null },
                });
                if (!findInstitution) {
                  throw createError(404, "Institution not found");
                }

                await sendEmailService.sendEmail("actionObligation", {
                  to: toEmails,
                  action: "Created",
                  obligationId: newObligation.id,
                  obligationName: newObligation.name,
                  obligationType: newObligation.type,
                  obligationCategory: newObligation.category,
                  institution: findInstitution.name,
                  description: newObligation.description,
                  dueDate: formatDate(newObligation.dueDate),
                  status: newObligation.status,
                  cc: ccEmails,
                });
              } else {
                const nextDueDate = new Date(obligation.dueDate);
                nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
                nextDueDate.setDate(nextDueDate.getDate() + 30);

                const newObligation = await prisma.obligation.create({
                  data: {
                    name: obligation.name,
                    type: obligation.type,
                    category: obligation.category,
                    institutionId: obligation.institutionId,
                    description: obligation.description,
                    dueDate: nextDueDate,
                    status: "PREPARING",
                    renewal: obligation.renewal,
                  },
                });
                const userObligations = await prisma.userObligation.findMany({
                  where: { obligationId },
                });

                const newUserObligations = userObligations.map((uo) => ({
                  userId: uo.userId,
                  obligationId: newObligation.id,
                }));

                await prisma.userObligation.createMany({
                  data: newUserObligations,
                });

                const obligationUsers = await prisma.userObligation.findMany({
                  where: {
                    obligationId: newObligation.id,
                  },
                  include: {
                    user: {
                      include: {
                        auth: { select: { email: true } },
                      },
                    },
                  },
                });

                const toEmails = obligationUsers.map(
                  (obligationUser) => obligationUser.user.auth.email
                );

                const users = obligationUsers.map(
                  (obligationUser) => obligationUser.user.id
                );

                const ccEmails = await getCCEmails(users);

                const findInstitution = await prisma.institution.findUnique({
                  where: { id: obligation.institutionId, deletedAt: null },
                });
                if (!findInstitution) {
                  throw createError(404, "Institution not found");
                }

                await sendEmailService.sendEmail("actionObligation", {
                  to: toEmails,
                  action: "Created",
                  obligationId: newObligation.id,
                  obligationName: newObligation.name,
                  obligationType: newObligation.type,
                  obligationCategory: newObligation.category,
                  institution: findInstitution.name,
                  description: newObligation.description,
                  dueDate: formatDate(newObligation.dueDate),
                  status: newObligation.status,
                  cc: ccEmails,
                });
              }
            }
          } else {
            await prisma.obligation.update({
              where: { id: obligationId },
              data: {
                status,
                latestUpdate: new Date(),
                updatedAt: new Date(),
              },
            });
          }
        }
      });

      return res.status(201).json({
        success: true,
        message: "User Progress Obligation updated successfully",
        fileUrl: fileUrl || "No file uploaded",
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};
