const prisma = require("../../application/database");
const { createError } = require("../../models/errorResponse");
const sendEmailService = require("../../utils/sendEmail");

const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

module.exports = {
  createProgressTicket: async (req, res, next) => {
    try {
      const { ticketId } = req.params;
      const { id, role } = res.user;
      const { status, description, urlDocs } = req.body;

      if (!ticketId) throw createError(400, "Ticket ID is required");
      if (!status || !description)
        throw createError(400, "Status and description are required");

      const findTicket = await prisma.ticket.findUnique({
        where: { id: ticketId },
      });
      if (!findTicket || findTicket.deletedAt)
        throw createError(404, "Ticket not found");

      const currentStatus = findTicket.status;

      const allowedStatusesForUser = [null, "PREPARING", "FEEDBACK"];
      const allowedStatusesForExternalRelation = [
        "SUBMITTING",
        "VERIFICATION",
        "FEEDBACK",
        "APPROVAL",
        "COMPLETE",
      ];

      if (role === "USER" && !allowedStatusesForUser.includes(currentStatus))
        throw createError(
          403,
          "You are not allowed to update progress for this ticket in its current status."
        );

      if (
        role === "EXTERNAL_RELATION" &&
        !allowedStatusesForExternalRelation.includes(currentStatus)
      )
        throw createError(
          403,
          "You are not allowed to update progress for this ticket in its current status."
        );

      if (role !== "ADMIN" && !currentStatus)
        throw createError(
          403,
          "You are not allowed to update progress for this ticket in its current status."
        );

      const progressTicket = await prisma.progressTicket.create({
        data: {
          ticketId,
          userId: id,
          status,
          description,
          urlDocs: urlDocs || null,
        },
      });

      await prisma.ticket.update({
        where: { id: ticketId },
        data: { status: progressTicket.status },
      });

      const user = await prisma.user.findUnique({
        where: { id },
        select: { name: true },
      });

      if (!user) throw createError(404, "User not found");

      const ticketUsers = await prisma.ticketUser.findMany({
        where: { ticketId, deletedAt: null },
        include: {
          user: {
            include: { auth: { select: { email: true } } },
          },
        },
      });

      const adminUsers = await prisma.user.findMany({
        where: { role: "ADMIN", deletedAt: null },
        include: { auth: { select: { email: true } } },
      });

      let to = [];
      let cc = [];
      let name = [];

      if (role === "USER") {
        const userEmails = ticketUsers
          .filter(
            (tu) => tu.ticketRole === "External Relation PIC Permit & License"
          )
          .map((tu) => tu.user.auth.email);
        const userNames = ticketUsers
          .filter(
            (tu) => tu.ticketRole === "External Relation PIC Permit & License"
          )
          .map((tu) => tu.user.name);

        if (userEmails.length === userNames.length) {
          for (let i = 0; i < userEmails.length; i++) {
            to.push(userEmails[i]);
            name.push(userNames[i]);
          }
        }

        cc = [
          ...ticketUsers
            .filter(
              (tu) =>
                tu.ticketRole ===
                "External Relation Escalation Permit & License"
            )
            .map((tu) => tu.user.auth.email),
          ...adminUsers
            .filter((tu) => tu.role === "ADMIN")
            .map((tu) => tu.auth.email),
        ];
      } else if (role === "EXTERNAL_RELATION") {
        const userEmails = ticketUsers
          .filter((tu) => tu.ticketRole === "Owner PIC Permit & License")
          .map((tu) => tu.user.auth.email);
        const userNames = ticketUsers
          .filter((tu) => tu.ticketRole === "Owner PIC Permit & License")
          .map((tu) => tu.user.name);

        if (userEmails.length === userNames.length) {
          for (let i = 0; i < userEmails.length; i++) {
            to.push(userEmails[i]);
            name.push(userNames[i]);
          }
        }

        cc = [
          ...ticketUsers
            .filter(
              (tu) => tu.ticketRole === "Owner Escalation Permit & License"
            )
            .map((tu) => tu.user.auth.email),
          ...adminUsers
            .filter((tu) => tu.role === "ADMIN")
            .map((tu) => tu.auth.email),
        ];
      } else if (role === "ADMIN") {
        const externalEmails = ticketUsers
          .filter(
            (tu) => tu.ticketRole === "External Relation PIC Permit & License"
          )
          .map((tu) => tu.user.auth.email);
        const ownerEmails = ticketUsers
          .filter((tu) => tu.ticketRole === "Owner PIC Permit & License")
          .map((tu) => tu.user.auth.email);

        const externalNames = ticketUsers
          .filter(
            (tu) => tu.ticketRole === "External Relation PIC Permit & License"
          )
          .map((tu) => tu.user.name);
        const ownerNames = ticketUsers
          .filter((tu) => tu.ticketRole === "Owner PIC Permit & License")
          .map((tu) => tu.user.name);

        for (let i = 0; i < externalEmails.length; i++) {
          to.push(externalEmails[i]);
          name.push(externalNames[i]);
        }

        for (let i = 0; i < ownerEmails.length; i++) {
          to.push(ownerEmails[i]);
          name.push(ownerNames[i]);
        }

        cc = [
          ...ticketUsers
            .filter(
              (tu) =>
                tu.ticketRole ===
                "External Realtion Escalation Permit & License"
            )
            .map((tu) => tu.user.auth.email),
          ...ticketUsers
            .filter(
              (tu) => tu.ticketRole === "Owner Escalation Permit & License"
            )
            .map((tu) => tu.user.auth.email),
          ...adminUsers
            .filter((tu) => tu.role === "ADMIN")
            .map((tu) => tu.auth.email),
        ];
      }

      for (let i = 0; i < to.length; i++) {
        await sendEmailService.sendEmail("rememberNotification", {
          to: [to[i]],
          ticketId: findTicket.ticketId,
          name: name[i],
          permitName: findTicket.permitName,
          lastStatus: progressTicket.status,
          lastStatusDescription: description,
          lastUpdate: formatDate(new Date()),
          lastUpdateBy: user.name,
          cc,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Progress Ticket created successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
