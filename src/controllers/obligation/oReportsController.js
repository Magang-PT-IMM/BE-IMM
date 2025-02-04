const prisma = require("../../application/database");
const { createError } = require("../../models/errorResponse");
const sendEmailService = require("../../utils/sendEmail");
const { formatDate } = require("../../utils/dateFormat");
const { getCCEmails } = require("../../utils/ccEmails");

module.exports = {
  createObligationReport: async (req, res, next) => {
    try {
      const {
        name,
        category,
        institutionId,
        description,
        dueDate,
        users,
        renewal,
      } = req.body;

      if (
        !name ||
        !description ||
        !dueDate ||
        !Array.isArray(users) ||
        !renewal ||
        users.length === 0
      ) {
        throw createError(
          400,
          "Name, description, dueDate, and users are required"
        );
      }

      const existingObligation = await prisma.obligation.findFirst({
        where: { name, deletedAt: null },
      });
      if (existingObligation) {
        throw createError(409, "Obligation Report already exists");
      }
      const findInstitution = await prisma.institution.findUnique({
        where: { id: institutionId, deletedAt: null },
      });
      if (!findInstitution) {
        throw createError(404, "Institution not found");
      }

      await prisma.$transaction(
        async (prisma) => {
          const newObligation = await prisma.obligation.create({
            data: {
              name,
              type: "REPORT",
              category,
              institutionId,
              description,
              dueDate: new Date(dueDate),
              status: "PREPARING",
              renewal: renewal || false,
            },
          });

          const userObligationData = users.map((userId) => ({
            userId,
            obligationId: newObligation.id,
          }));

          await prisma.userObligation.createMany({
            data: userObligationData,
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

          const ccEmails = await getCCEmails(users);
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
        },
        { timeout: 20000 }
      );
      return res.status(201).json({
        success: true,
        message: "Obligation Report created successfully",
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  updateObligationReport: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        name,
        category,
        institutionId,
        description,
        dueDate,
        users,
        renewal,
      } = req.body;

      if (!id) {
        throw createError(400, "Obligation ID is required");
      }

      await prisma.$transaction(async (prisma) => {
        const existingObligation = await prisma.obligation.findUnique({
          where: { id, deletedAt: null },
        });
        console.log(existingObligation);

        if (!existingObligation) {
          throw createError(404, "Obligation Report not found");
        }
        const findInstitution = await prisma.institution.findUnique({
          where: { id: institutionId, deletedAt: null },
        });
        if (!findInstitution) {
          throw createError(404, "Institution not found");
        }

        const updatedObligation = await prisma.obligation.update({
          where: { id },
          data: {
            name: name || existingObligation.name,
            category: category || existingObligation.category,
            institutionId: institutionId || existingObligation.institutionId,
            description: description || existingObligation.description,
            dueDate: dueDate ? new Date(dueDate) : existingObligation.dueDate,
            renewal: renewal || existingObligation.renewal,
            updatedAt: new Date(),
          },
        });

        if (Array.isArray(users) && users.length > 0) {
          await prisma.userObligation.deleteMany({
            where: { obligationId: id },
          });

          const userObligationData = users.map((userId) => ({
            userId,
            obligationId: id,
          }));

          await prisma.userObligation.createMany({
            data: userObligationData,
          });
        }

        const obligationUsers = await prisma.userObligation.findMany({
          where: {
            obligationId: updatedObligation.id,
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

        const ccEmails = await getCCEmails(users);

        await sendEmailService.sendEmail("actionObligation", {
          to: toEmails,
          action: "Updated",
          obligationId: updatedObligation.id,
          obligationName: updatedObligation.name,
          obligationType: updatedObligation.type,
          obligationCategory: updatedObligation.category,
          institution: findInstitution.name,
          description: updatedObligation.description,
          dueDate: formatDate(updatedObligation.dueDate),
          status: updatedObligation.status,
          cc: ccEmails,
        });
      });
      return res.status(200).json({
        success: true,
        message: "Obligation Report updated successfully",
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  getAllObligationReports: async (req, res, next) => {
    try {
      const obligations = await prisma.obligation.findMany({
        where: { type: "REPORT", deletedAt: null },
        include: {
          institution: {
            select: {
              id: true,
              name: true,
            },
          },
          userObligations: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  department: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return res.status(200).json({
        success: true,
        message: "Obligation Reports fetched successfully",
        obligations,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  getObligationReportById: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!id) {
        throw createError(400, "Obligation ID is required");
      }

      const obligation = await prisma.obligation.findUnique({
        where: { id },
        include: {
          institution: {
            select: {
              id: true,
              name: true,
            },
          },
          userObligations: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  department: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
          userProgressObligations: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  department: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!obligation) {
        throw createError(404, "Obligation Report not found");
      }

      return res.status(200).json({
        success: true,
        message: "Obligation Report fetched successfully",
        obligation,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  deleteObligationReport: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!id) {
        throw createError(400, "Obligation ID is required");
      }
      await prisma.$transaction(async (prisma) => {
        const existingObligation = await prisma.obligation.findUnique({
          where: { id, deletedAt: null },
        });

        if (!existingObligation) {
          throw createError(404, "Obligation Report not found");
        }

        await prisma.obligation.update({
          where: { id },
          data: { deletedAt: new Date() },
        });

        await prisma.userObligation.updateMany({
          where: { obligationId: id },
          data: { deletedAt: new Date() },
        });

        await prisma.userProgressObligation.updateMany({
          where: { obligationId: id },
          data: { deletedAt: new Date() },
        });
      });

      return res.status(200).json({
        success: true,
        message: "Obligation Report deleted successfully",
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  getObligationReportsByUserId: async (req, res, next) => {
    try {
      const { id } = res.user;

      if (!id) {
        throw createError(400, "User ID is required");
      }

      const obligations = await prisma.obligation.findMany({
        where: {
          deletedAt: null,
          type: "REPORT",
          userObligations: {
            some: {
              userId: id,
              deletedAt: null,
            },
          },
        },
        include: {
          institution: {
            select: {
              id: true,
              name: true,
            },
          },
          userObligations: {
            include: {
              user: {
                select: {
                  department: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return res.status(200).json({
        success: true,
        message: "Obligation Reports fetched successfully",
        obligations,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  getObligationsByDepartment: async (req, res, next) => {
    try {
      const { id } = res.user;

      if (!id) {
        throw createError(401, "User not authenticated");
      }

      const userData = await prisma.user.findUnique({
        where: { id },
        select: { departmentId: true },
      });

      if (!userData || !userData.departmentId) {
        throw createError(404, "User does not belong to any department");
      }

      const departmentId = userData.departmentId;

      const usersInDepartment = await prisma.user.findMany({
        where: { departmentId: departmentId },
        select: { id: true },
      });

      if (usersInDepartment.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No obligations found for this department",
          obligations: [],
        });
      }

      const userIds = usersInDepartment.map((user) => user.id);
      console.log(userIds);

      const obligations = await prisma.obligation.findMany({
        where: {
          deletedAt: null,
          type: "REPORT",
          userObligations: {
            some: {
              userId: { in: userIds },
            },
          },
        },
        include: {
          institution: {
            select: {
              id: true,
              name: true,
            },
          },
          userObligations: {
            include: {
              user: {
                select: {
                  department: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      console.log(obligations);

      return res.status(200).json({
        success: true,
        message: "Obligation Reports fetched successfully",
        obligations,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};
