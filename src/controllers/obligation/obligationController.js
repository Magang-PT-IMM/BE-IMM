const prisma = require("../../application/database");
const { createError } = require("../../models/errorResponse");
const sendEmailService = require("../../utils/sendEmail");
const { formatDate } = require("../../utils/dateFormat");

module.exports = {
  createObligation: async (req, res, next) => {
    try {
      const {
        name,
        type,
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
        !type ||
        users.length === 0
      ) {
        throw createError(
          400,
          "Name, Type, description, dueDate, users, and renewal are required"
        );
      }
      const existingObligation = await prisma.obligation.findFirst({
        where: { name, deletedAt: null },
      });
      if (existingObligation) {
        throw createError(409, "Obligation Payment already exists");
      }

      const findInstitution = await prisma.institution.findUnique({
        where: { id: institutionId, deletedAt: null },
      });
      if (!findInstitution) {
        throw createError(404, "Institution not found");
      }
      await prisma.$transaction(async (prisma) => {
        const newObligation = await prisma.obligation.create({
          data: {
            name,
            type,
            category,
            institutionId,
            description,
            dueDate: new Date(dueDate),
            status: "PROCESS",
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
      });

      return res.status(201).json({
        success: true,
        message: "Obligation Created Successfully",
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  updateObligation: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        name,
        type,
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
        !type ||
        users.length === 0 ||
        !category ||
        !id
      ) {
        throw createError(
          400,
          "Name, Type, category, description, dueDate, users, and renewal are required"
        );
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

        await prisma.obligation.update({
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
      });
      return res.status(200).json({
        success: true,
        message: "Obligation Updated Successfully",
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  deleteObligation: async (req, res, next) => {
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
        message: "Obligation Deleted Successfully",
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  getObligationByUserId: async (req, res, next) => {
    try {
      const { id } = res.user;
      const { month, year, type, search, order } = req.query;

      if (!id) {
        throw createError(400, "User ID is required");
      }

      let whereCondition = {
        deletedAt: null,
        userObligations: {
          some: {
            userId: id,
            deletedAt: null,
          },
        },
      };

      if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);
        whereCondition.dueDate = {
          gte: startDate,
          lt: endDate,
        };
      }

      if (type) {
        whereCondition.type = type;
      }

      if (search) {
        whereCondition.name = { contains: search, mode: "insensitive" };
      }

      let orderBy = { dueDate: "asc" };

      if (
        order &&
        (order.toLowerCase() === "asc" || order.toLowerCase() === "desc")
      ) {
        orderBy = { dueDate: order.toLowerCase() };
      }

      const obligations = await prisma.obligation.findMany({
        where: whereCondition,
        orderBy,
        include: {
          institution: {
            select: { id: true, name: true },
          },
          userObligations: {
            include: {
              user: {
                select: {
                  department: { select: { name: true } },
                },
              },
            },
          },
        },
      });

      return res.status(200).json({
        success: true,
        message: "Obligation fetched successfully",
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
      const { month, year, type, search, order } = req.query;

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

      let whereCondition = {
        deletedAt: null,
        userObligations: {
          some: { userId: { in: userIds } },
        },
      };

      if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);
        whereCondition.dueDate = {
          gte: startDate,
          lt: endDate,
        };
      }

      if (type) {
        whereCondition.type = type;
      }

      if (search) {
        whereCondition.name = { contains: search, mode: "insensitive" };
      }

      let orderBy = { dueDate: "asc" };

      if (
        order &&
        (order.toLowerCase() === "asc" || order.toLowerCase() === "desc")
      ) {
        orderBy = { dueDate: order.toLowerCase() };
      }

      const obligations = await prisma.obligation.findMany({
        where: whereCondition,
        orderBy,
        include: {
          institution: {
            select: { id: true, name: true },
          },
          userObligations: {
            include: {
              user: {
                select: {
                  department: { select: { name: true } },
                },
              },
            },
          },
        },
      });

      return res.status(200).json({
        success: true,
        message: "Obligation fetched successfully",
        obligations,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  getAllObligation: async (req, res, next) => {
    try {
      const { month, year, type, status, search, category, order } = req.query;

      let whereCondition = { deletedAt: null };

      if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        whereCondition.dueDate = {
          gte: startDate,
          lt: endDate,
        };
      }

      if (type) {
        whereCondition.type = type;
      }

      if (status) {
        whereCondition.status = status;
      }

      if (search) {
        whereCondition.name = { contains: search, mode: "insensitive" };
      }

      if (category) {
        whereCondition.category = category;
      }

      let orderBy = { dueDate: "asc" };

      if (
        order &&
        (order.toLowerCase() === "asc" || order.toLowerCase() === "desc")
      ) {
        orderBy = { dueDate: order.toLowerCase() };
      }

      const obligations = await prisma.obligation.findMany({
        where: whereCondition,
        include: {
          institution: {
            select: { id: true, name: true },
          },
          userObligations: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  department: { select: { name: true } },
                },
              },
            },
          },
        },
      });

      return res.status(200).json({
        success: true,
        message: "Obligation fetched successfully",
        obligations,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  getObligationById: async (req, res, next) => {
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
        throw createError(404, "Obligation not found");
      }

      return res.status(200).json({
        success: true,
        message: "Obligation fetched successfully",
        obligation,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  undeletedObligation: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!id) {
        throw createError(400, "Obligation ID is required");
      }
      await prisma.$transaction(async (prisma) => {
        const deletedObligation = await prisma.obligation.findUnique({
          where: { id },
        });

        if (!deletedObligation) {
          throw createError(404, "Obligation Report not found");
        }

        await prisma.obligation.update({
          where: { id },
          data: { deletedAt: null },
        });

        await prisma.userObligation.updateMany({
          where: { obligationId: id },
          data: { deletedAt: null },
        });

        await prisma.userProgressObligation.updateMany({
          where: { obligationId: id },
          data: { deletedAt: null },
        });
      });

      return res.status(200).json({
        success: true,
        message: "Obligation undeleted successfully",
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};
