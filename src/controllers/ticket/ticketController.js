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

      return res
        .status(200)
        .json({ success: true, message: "Ticket updated successfully" });
    } catch (error) {
      next(error);
    }
  },
};
