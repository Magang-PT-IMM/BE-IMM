const prisma = require("../../application/database");
const { createError } = require("../../models/errorResponse");
const sendEmailService = require("../../utils/sendEmail");
const { formatDate } = require("../../utils/dateFormat");

const generateTicketId = async () => {
  const ticketCount = await prisma.ticket.count();

  const numberPart = ticketCount + 1;
  const digitLength = Math.max(4, String(numberPart).length);

  const ticketId = `T-IMM-${String(numberPart).padStart(digitLength, "0")}`;

  return ticketId;
};
const generatePermitId = async () => {
  const ticketCount = await prisma.permit.count();

  const numberPart = ticketCount + 1;
  const digitLength = Math.max(4, String(numberPart).length);

  const ticketId = `P-IMM-${String(numberPart).padStart(digitLength, "0")}`;

  return ticketId;
};

module.exports = {
  createTicket: async (req, res, next) => {
    try {
      const {
        permitCategoryId,
        ownerDepartmentId,
        institutionId,
        permitName,
        description,
        users,
      } = req.body;

      if (
        !permitCategoryId ||
        !ownerDepartmentId ||
        !institutionId ||
        !permitName ||
        !description ||
        !users ||
        users.length === 0
      ) {
        throw new createError(400, "All fields are required");
      }

      const ticketId = await generateTicketId();

      const findTicket = await prisma.ticket.findFirst({
        where: {
          permitName,
          deletedAt: null,
        },
      });

      if (findTicket) {
        throw new createError(409, "Ticket already exists");
      }

      const permitCategory = await prisma.permitCategory.findUnique({
        where: {
          id: permitCategoryId,
        },
      });

      if (!permitCategory) {
        throw new createError(404, "Permit Category not found");
      }

      const institution = await prisma.institution.findUnique({
        where: {
          id: institutionId,
        },
      });

      if (!institution) {
        throw new createError(404, "Institution not found");
      }

      const department = await prisma.department.findUnique({
        where: {
          id: ownerDepartmentId,
        },
        select: {
          name: true,
        },
      });

      if (!department) {
        throw new createError(404, "Department not found");
      }

      const departmentUsers = await prisma.user.findMany({
        where: {
          departmentId: ownerDepartmentId,
          deletedAt: null,
        },
        select: {
          auth: {
            select: {
              email: true,
            },
          },
        },
      });

      if (departmentUsers.length === 0) {
        throw new createError(404, "No users found in the department");
      }

      const adminUsers = await prisma.user.findMany({
        where: {
          role: "ADMIN",
          deletedAt: null,
        },
        select: {
          auth: { select: { email: true } },
        },
      });

      const ccEmails = [
        ...new Set([
          ...departmentUsers.map((user) => user.auth.email),
          ...adminUsers.map((user) => user.auth.email),
        ]),
      ];

      let externalRelationPICEmails = [];
      let externalRelationEscalationEmails = [];
      let externalRelationPICNames = [];
      let permitDetails;

      await prisma.$transaction(async (prisma) => {
        const ticket = await prisma.ticket.create({
          data: {
            ticketId,
            permitCategoryId,
            ownerDepartmentId,
            institutionId,
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

        const ticketUsers = await prisma.ticketUser.findMany({
          where: {
            ticketId: ticket.id,
            deletedAt: null,
          },
          include: {
            user: {
              include: {
                auth: {
                  select: {
                    email: true,
                  },
                },
              },
            },
          },
        });

        const externalRelationPICUsers = ticketUsers.filter(
          (ticketUser) =>
            ticketUser.ticketRole === "External Relation PIC Permit & License"
        );

        if (externalRelationPICUsers.length === 0) {
          throw new createError(
            404,
            "No External Relation PIC Permit & License user found for this ticket"
          );
        }

        externalRelationPICEmails = externalRelationPICUsers.map(
          (ticketUser) => ticketUser.user.auth.email
        );
        externalRelationPICNames = externalRelationPICUsers.map(
          (ticketUser) => ticketUser.user.name
        );

        const externalRelationEscalationUsers = ticketUsers.filter(
          (ticketUser) =>
            ticketUser.ticketRole ===
            "External Realtion Escalation Permit & License"
        );

        externalRelationEscalationEmails = externalRelationEscalationUsers.map(
          (ticketUser) => ticketUser.user.auth.email
        );

        permitDetails = {
          ticketId,
          department: department.name,
          permitName,
          permitCategory: permitCategory.name,
          institution: institution.name,
          description,
        };
      });

      for (let i = 0; i < externalRelationEmails.length; i++) {
        const email = externalRelationPICEmails[i];
        const name = externalRelationPICNames[i];

        await sendEmailService.sendEmail("createTicket", {
          to: [email],
          ticketId: permitDetails.ticketId,
          department: permitDetails.department,
          permitName: permitDetails.permitName,
          permitCategory: permitDetails.permitCategory,
          institution: permitDetails.institution,
          externalRelation: name,
          description: permitDetails.description,
          cc: [...ccEmails, ...externalRelationEscalationEmails],
        });
      }

      return res
        .status(201)
        .json({ success: true, message: "Ticket created successfully" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  updateTicket: async (req, res, next) => {
    try {
      const {
        permitCategoryId,
        ownerDepartmentId,
        institutionId,
        permitName,
        description,
        users,
      } = req.body;
      const { id } = req.params;

      if (
        !permitCategoryId ||
        !ownerDepartmentId ||
        !institutionId ||
        !permitName ||
        !description ||
        !users
      ) {
        throw new createError(400, "All fields are required");
      }

      const existingTicket = await prisma.ticket.findFirst({
        where: {
          id: id,
          deletedAt: null,
        },
      });

      if (!existingTicket) {
        throw new createError(404, "Ticket not found");
      }

      await prisma.$transaction(async (prisma) => {
        await prisma.ticket.update({
          where: { id: existingTicket.id },
          data: {
            permitCategoryId,
            ownerDepartmentId,
            institutionId,
            permitName,
            description,
          },
        });
        await prisma.ticketUser.deleteMany({
          where: {
            ticketId: existingTicket.id,
          },
        });

        await prisma.ticketUser.createMany({
          data: users.map((user) => ({
            userId: user.id,
            ticketId: existingTicket.id,
            ticketRole: user.role,
          })),
        });

        const ticketUsers = await prisma.ticketUser.findMany({
          where: {
            ticketId: existingTicket.id,
            deletedAt: null,
          },
          include: {
            user: {
              include: {
                auth: {
                  select: {
                    email: true,
                  },
                },
              },
            },
          },
        });

        await sendEmailService.sendEmail("updateTicket", {
          to,
          ticketId,
          department,
          permitName,
          permitCategory,
          institution,
          description,
          cc,
        });
      });

      return res
        .status(200)
        .json({ success: true, message: "Ticket updated successfully" });
    } catch (error) {
      console.log(error);
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
        throw new createError(404, "Ticket not found");
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
      console.log(error);
      next(error);
    }
  },

  undeleteTicket: async (req, res, next) => {
    try {
      const { id } = req.params;

      const existingTicket = await prisma.ticket.findFirst({
        where: {
          id: id,
        },
      });
      if (!existingTicket) {
        throw new createError(404, "Ticket not found");
      }
      await prisma.$transaction(async (prisma) => {
        await prisma.ticket.update({
          where: { id: id },
          data: {
            deletedAt: null,
          },
        });
        await prisma.ticketUser.updateMany({
          where: {
            ticketId: id,
          },
          data: {
            deletedAt: null,
          },
        });
        await prisma.progressTicket.updateMany({
          where: {
            ticketId: id,
          },
          data: {
            deletedAt: null,
          },
        });
      });

      return res
        .status(200)
        .json({ success: true, message: "Ticket undeleted successfully" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getAllTicket: async (req, res, next) => {
    try {
      const tickets = await prisma.ticket.findMany({
        where: {
          deletedAt: null,
        },
        include: {
          permitCategory: true,
          department: true,
          institution: true,
        },
      });
      const data = tickets.map((ticket) => {
        return {
          id: ticket.id,
          ticketId: ticket.ticketId,
          name: ticket.permitName,
          category: ticket.permitCategory.name,
          department: ticket.department.name,
          institution: ticket.institution.name,
          status: ticket.status,
          description: ticket.description,
          lastUpdate: formatDate(ticket.updatedAt),
        };
      });
      return res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getTicketById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const ticket = await prisma.ticket.findUnique({
        where: { id },
        include: {
          permitCategory: true,
          department: true,
          institution: true,
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
        throw new createError(404, "Ticket not found");
      }
      const data = {
        id: ticket.id,
        ticketId: ticket.ticketId,
        name: ticket.permitName,
        category: ticket.permitCategory?.name || "Unknown Category",
        department: ticket.department?.name || "Unknown Department",
        institution: ticket.institution?.name || "Unknown Institution",
        status: ticket.status || "Ticket don't have status",
        description: ticket.description || "No Description",
        users: ticket.ticketUser.map((ticketUser) => ({
          name: ticketUser.user.name,
          role: ticketUser.ticketRole,
        })),
        progress: ticket.progressTicket.map((progress) => ({
          id: progress.id,
          status: progress.status,
          description: progress.description,
          urlDocs: progress.urlDocs,
          user: {
            name: progress.user.name,
          },
          createdAt: formatDate(progress.createdAt),
        })),
      };
      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.log(error);
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
        include: {
          permitCategory: true,
          department: true,
          institution: true,
        },
      });

      if (!tickets.length) {
        return res.status(404).json({
          success: false,
          message: "No active tickets found for this user.",
        });
      }

      const data = tickets.map((ticket) => {
        return {
          id: ticket.id,
          ticketId: ticket.ticketId,
          name: ticket.permitName,
          category: ticket.permitCategory.name,
          department: ticket.department.name,
          institution: ticket.institution.name,
          status: ticket.status,
          description: ticket.description,
          lastUpdate: formatDate(ticket.updatedAt),
        };
      });
      return res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  createPermitFromTicket: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        permitCategoryId,
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

      const requiredFields = [
        { field: "permitCategoryId", value: permitCategoryId },
        { field: "ownerDepartmentId", value: ownerDepartmentId },
        { field: "institutionId", value: institutionId },
        { field: "permitName", value: permitName },
        { field: "permitNumber", value: permitNumber },
        { field: "issuedDate", value: issuedDate },
        { field: "validityPeriod", value: validityPeriod },
        { field: "expireDate", value: expireDate },
        { field: "description", value: description },
        { field: "renewalRequirement", value: renewalRequirement },
        { field: "notification", value: notification },
        { field: "urlDocument", value: urlDocument },
        { field: "preparationPeriod", value: preparationPeriod },
      ];

      for (const { field, value } of requiredFields) {
        if (!value) {
          throw new createError(400, `${field} is required`);
        }
      }

      const ticket = await prisma.ticket.findUnique({
        where: { id },
      });

      if (!ticket) {
        throw new createError(404, "Ticket not found");
      }

      if (ticket.status !== "COMPLETE") {
        throw new createError(400, "Ticket is not complete");
      }

      const permitId = await generatePermitId();

      await prisma.$transaction(async (prisma) => {
        const newPermit = await prisma.permit.create({
          data: {
            permitId,
            permitCategoryId: permitCategoryId,
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

        const ticketUsers = await prisma.ticketUser.findMany({
          where: { ticketId: id },
        });

        const permitUsersData = ticketUsers.map((ticketUser) => ({
          permitId: newPermit.id,
          userId: ticketUser.userId,
          permitRole: ticketUser.ticketRole,
        }));

        await prisma.permitUser.createMany({
          data: permitUsersData,
        });

        await prisma.ticket.update({
          where: { id },
          data: {
            status: "CLOSED",
            deletedAt: new Date(),
          },
        });

        await prisma.ticketUser.updateMany({
          where: { ticketId: id },
          data: { deletedAt: new Date() },
        });

        await prisma.progressTicket.updateMany({
          where: { ticketId: id },
          data: { deletedAt: new Date() },
        });

        const permitCategory = await prisma.permitCategory.findUnique({
          where: { id: permitCategoryId },
        });

        const institution = await prisma.institution.findUnique({
          where: { id: institutionId },
        });

        const department = await prisma.department.findUnique({
          where: { id: ownerDepartmentId },
        });

        const permitUsers = await prisma.permitUser.findMany({
          where: { permitId: newPermit.id },
          include: { user: { include: { auth: true } } },
        });

        const admin = await prisma.user.findMany({
          where: { role: "ADMIN" },
          include: { auth: true },
        });

        const to = permitUsers
          .filter((user) => user.permitRole !== "ADMIN")
          .map((user) => user.user.auth.email);

        const cc = admin
          .filter((user) => user.role === "ADMIN")
          .map((user) => user.user.auth.email);

        await sendEmailService.sendEmail("createPermit", {
          permitId: newPermit.permitId,
          permitNumber: newPermit.permitNumber,
          permitName: newPermit.permitName,
          permitCategory: permitCategory?.name || "Unknown",
          institution: institution?.name || "Unknown",
          department: department?.name || "Unknown",
          issueDate: newPermit.issuedDate,
          validityPeriod: newPermit.validityPeriod,
          expireDate: newPermit.expireDate,
          status: newPermit.status,
          description: newPermit.description,
          to,
          cc,
        });
      });

      return res
        .status(200)
        .json({ success: true, message: "Permit created successfully" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  getAllTicketDeleted: async (req, res, next) => {
    try {
      const tickets = await prisma.ticket.findMany({
        where: {
          deletedAt: { not: null },
        },
        include: {
          permitCategory: true,
          department: true,
          institution: true,
        },
      });

      if (!tickets.length) {
        return res.status(404).json({
          success: false,
          message: "No deleted tickets found.",
        });
      }

      const data = tickets.map((ticket) => {
        return {
          id: ticket.id,
          ticketId: ticket.ticketId,
          name: ticket.permitName,
          category: ticket.permitCategory.name,
          department: ticket.department.name,
          institution: ticket.institution.name,
          status: ticket.status,
          description: ticket.description,
          lastUpdate: formatDate(ticket.updatedAt),
        };
      });

      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  getTicketDeletedByUser: async (req, res, next) => {
    try {
      const { id } = res.user;
      const ticketUsers = await prisma.ticketUser.findMany({
        where: {
          userId: id,
          deletedAt: { not: null },
        },
      });

      const tickets = await prisma.ticket.findMany({
        where: {
          id: {
            in: ticketUsers.map((ticketUser) => ticketUser.ticketId),
          },
          deletedAt: { not: null },
        },
        include: {
          permitCategory: true,
          department: true,
          institution: true,
        },
      });

      if (!tickets.length) {
        return res.status(404).json({
          success: false,
          message: "No deleted tickets found for this user.",
        });
      }

      const data = tickets.map((ticket) => {
        return {
          id: ticket.id,
          ticketId: ticket.ticketId,
          name: ticket.permitName,
          category: ticket.permitCategory.name,
          department: ticket.department.name,
          institution: ticket.institution.name,
          status: ticket.status,
          description: ticket.description,
          lastUpdate: formatDate(ticket.updatedAt),
        };
      });

      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  getTicketDeletedById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const ticket = await prisma.ticket.findUnique({
        where: { id },
        include: {
          permitCategory: true,
          department: true,
          institution: true,
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

      if (!ticket || ticket.deletedAt === null) {
        throw new createError(404, "Ticket not found or not deleted");
      }

      const data = {
        id: ticket.id,
        ticketId: ticket.ticketId,
        name: ticket.permitName,
        category: ticket.permitCategory?.name || "Unknown Category",
        department: ticket.department?.name || "Unknown Department",
        institution: ticket.institution?.name || "Unknown Institution",
        status: ticket.status || "Ticket doesn't have status",
        description: ticket.description || "No Description",
        users: ticket.ticketUser.map((ticketUser) => ({
          name: ticketUser.user.name,
          role: ticketUser.ticketRole,
        })),
        progress: ticket.progressTicket.map((progress) => ({
          id: progress.id,
          status: progress.status,
          description: progress.description,
          urlDocs: progress.urlDocs,
          user: {
            name: progress.user.name,
          },
          createdAt: formatDate(progress.createdAt),
        })),
      };

      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
