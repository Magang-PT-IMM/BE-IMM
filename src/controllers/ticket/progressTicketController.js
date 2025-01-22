const prisma = require("../../application/database");
const { createError } = require("../../models/errorResponse");

module.exports = {
  createProgressTicket: async (req, res, next) => {
    try {
      const { ticketId } = req.params;
      const { id } = res.user;
      const { status, description, urlDocs } = req.body;
      const findTicket = await prisma.ticket.findUnique({
        where: {
          id: ticketId,
          deletedAt: null,
        },
      });
      if (!findTicket) {
        throw createError(404, "Ticket not found");
      }
      if (!status || !description) {
        throw createError(400, "All fields are required");
      }
      const progressTicket = await prisma.progressTicket.create({
        data: {
          ticketId,
          userId: id,
          status,
          description,
          urlDocs: urlDocs ? urlDocs : null,
        },
      });
      await prisma.ticket.update({
        where: {
          id: ticketId,
        },
        data: {
          status: progressTicket.status,
        },
      });
      return res.status(200).json({
        success: true,
        message: "Progress Ticket created successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
