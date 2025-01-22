const prisma = require("../../application/database");
const { createError } = require("../../models/errorResponse");

const generateTicketId = async () => {
  const ticketCount = await prisma.ticket.count();

  const numberPart = ticketCount + 1;
  const digitLength = Math.max(4, String(numberPart).length);

  const ticketId = `IMM-${String(numberPart).padStart(digitLength, "0")}`;

  return ticketId;
};

module.exports = {
  createTicket: async (req, res) => {
    try {
      const {
        permitCategory,
        ownerDepartmentId,
        institutionId,
        permitName,
        description,
        users,
      } = req.body;

      if (
        !permitCategory ||
        !ownerDepartmentId ||
        !institutionId ||
        !permitName ||
        !description ||
        !users
      ) {
        throw createError(400, "All fields are required");
      }

      const ticketId = await generateTicketId();

      const findTicket = await prisma.ticket.findFirst({
        where: {
          permitName,
          deletedAt: null,
        },
      });

      if (findTicket) {
        throw createError(409, "Ticket already exists");
      }
      await prisma.$transaction(async (prisma) => {
        const ticket = await prisma.ticket.create({
          data: {
            permitCategory,
            ownerDepartmentId,
            institutionId,
            ticketId,
            permitName,
            description,
          },
        });

        await prisma.ticketUser.createMany({
          data: users.map((user) => ({
            userId: user.id,
            ticketId: ticket.id,
            ticketRole: user.role,
          })),
        });
      });

      return res
        .status(201)
        .json({ success: true, message: "Ticket created successfully" });
    } catch (error) {
      next(error);
    }
  },

  updateTicket: async (req, res, next) => {
    try {
      const {
        permitCategory,
        ownerDepartmentId,
        institutionId,
        permitName,
        description,
        users,
      } = req.body;
      const { id } = req.params;

      if (
        !permitCategory ||
        !ownerDepartmentId ||
        !institutionId ||
        !permitName ||
        !description ||
        !users
      ) {
        throw createError(400, "All fields are required");
      }

      const existingTicket = await prisma.ticket.findFirst({
        where: {
          id: id,
          deletedAt: null,
        },
      });

      if (!existingTicket) {
        throw createError(404, "Ticket not found");
      }
      await prisma.$transaction(async (prisma) => {
        await prisma.ticket.update({
          where: { id: id },
          data: {
            permitCategory,
            ownerDepartmentId,
            institutionId,
            permitName,
            description,
          },
        });
        await prisma.ticketUser.deleteMany({
          where: {
            ticketId: id,
          },
        });

        await prisma.ticketUser.createMany({
          data: users.map((user) => ({
            userId: user.id,
            ticketId: ticketId,
            ticketRole: user.role,
          })),
        });
      });

      return res
        .status(200)
        .json({ success: true, message: "Ticket updated successfully" });
    } catch (error) {
      next(error);
    }
  },
  deleteTicket: async (req, res, next) => {
    try {
      const { id } = req.params;

      const existingTicket = await prisma.ticket.findFirst({
        where: {
          id: id,
          deletedAt: null,
        },
      });
      if (!existingTicket) {
        throw createError(404, "Ticket not found");
      }
      await prisma.$transaction(async (prisma) => {
        await prisma.ticket.update({
          where: { id: id },
          data: {
            deletedAt: new Date(),
          },
        });
        await prisma.ticketUser.updateMany({
          where: {
            ticketId: id,
          },
          data: {
            deletedAt: new Date(),
          },
        });
        await prisma.progressTicket.updateMany({
          where: {
            ticketId: id,
          },
          data: {
            deletedAt: new Date(),
          },
        });
      });

      return res
        .status(200)
        .json({ success: true, message: "Ticket deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
  getAllTicket: async (req, res, next) => {
    try {
      const tickets = await prisma.ticket.findMany({
        where: {
          deletedAt: null,
        },
      });
      return res.status(200).json({ success: true, data: tickets });
    } catch (error) {
      next(error);
    }
  },
  getTicketById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const ticket = await prisma.ticket.findUnique({
        where: { id },
        include: {
          progressTicket: {
            orderBy: { createdAt: "desc" },
            include: {
              user: true,
            },
          },
          ticketUser: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!ticket) {
        throw createError(404, "Ticket not found");
      }

      return res.status(200).json({ success: true, data: ticket });
    } catch (error) {
      next(error);
    }
  },
  getAllTicketByUser: async (req, res, next) => {
    try {
      const { id } = res.user;
      const ticketUsers = await prisma.ticketUser.findMany({
        where: {
          userId: id,
          deletedAt: null,
        },
      });
      const tickets = await prisma.ticket.findMany({
        where: {
          id: {
            in: ticketUsers.map((ticketUser) => ticketUser.ticketId),
          },
          deletedAt: null,
        },
      });
      return res.status(200).json({ success: true, data: tickets });
    } catch (error) {
      next(error);
    }
  },

  createPermitFromTicket: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        permitCategory,
        ownerDepartmentId,
        institutionId,
        permitName,
        permitNumber,
        issuedDate,
        validityPeriod,
        expireDate,
        description,
        renewalRequirement,
        notification,
        urlDocument,
        preparationPeriod,
      } = req.body;
      const requiredFields = {
        permitCategory,
        ownerDepartmentId,
        institutionId,
        permitName,
        permitNumber,
        issuedDate,
        validityPeriod,
        expireDate,
        description,
        renewalRequirement,
        notification,
        urlDocument,
        preparationPeriod,
      };

      for (const [field, value] of Object.entries(requiredFields)) {
        if (!value) {
          throw createError(400, `${field} is required`);
        }
      }

      const ticket = await prisma.ticket.findUnique({
        where: { id },
      });

      if (!ticket) {
        throw createError(404, "Ticket not found");
      }
      await prisma.$transaction(async (prisma) => {
        await prisma.permit.create({
          data: {
            permitCategory,
            ownerDepartmentId,
            institutionId,
            permitName,
            permitNumber,
            issuedDate: new Date(issuedDate),
            validityPeriod,
            expireDate: new Date(expireDate),
            description,
            renewalRequirement,
            notification,
            urlDocument,
            preparationPeriod,
            status: "VALID",
          },
        });

        await prisma.ticket.update({
          where: { id },
          data: {
            status: "CLOSED",
            deletedAt: new Date(),
          },
        });
        await prisma.ticketUser.updateMany({
          where: {
            ticketId: id,
          },
          data: {
            deletedAt: new Date(),
          },
        });
        await prisma.progressTicket.updateMany({
          where: {
            ticketId: id,
          },
          data: {
            deletedAt: new Date(),
          },
        });
      });

      return res
        .status(200)
        .json({ success: true, message: "Permit created successfully" });
    } catch (error) {
      next(error);
    }
  },
};
