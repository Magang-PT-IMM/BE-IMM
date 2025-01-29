const prisma = require("../../application/database");
const { createError } = require("../../models/errorResponse");
const sendEmailService = require("../../utils/sendEmail");
const { formatDate } = require("../../utils/dateFormat");

const generatePermitId = async () => {
  const ticketCount = await prisma.permit.count();

  const numberPart = ticketCount + 1;
  const digitLength = Math.max(4, String(numberPart).length);

  const ticketId = `P-IMM-${String(numberPart).padStart(digitLength, "0")}`;

  return ticketId;
};

module.exports = {
  getAllPermit: async (req, res, next) => {
    try {
      const permits = await prisma.permit.findMany({
        where: { deletedAt: null },
        include: {
          permitCategory: true,
          department: true,
          institution: true,
        },
      });
      if (!permits) {
        throw new createError(404, "Permit not found");
      }
      const data = permits.map((permit) => {
        return {
          id: permit.id,
          permitId: permit.permitId,
          permitNumber: permit.permitNumber,
          permitName: permit.permitName,
          permitCategory: permit.permitCategory.name,
          department: permit.department.name,
          institution: permit.institution.name,
          issueDate: formatDate(permit.issuedDate),
          validityPeriod: permit.validityPeriod,
          status: permit.status,
          expireDate: formatDate(permit.expireDate),
          description: permit.description,
        };
      });
      return res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  getAllPermitByUsers: async (req, res, next) => {
    try {
      const { id } = res.user;
      const permits = await prisma.permitUser.findMany({
        where: { userId: id, deletedAt: null },
        include: {
          permit: {
            include: {
              permitCategory: true,
              department: true,
              institution: true,
            },
          },
        },
      });
      const data = permits.map((permitUser) => ({
        id: permitUser.permit.id,
        permitId: permitUser.permit.permitId,
        permitNumber: permitUser.permit.permitNumber,
        permitName: permitUser.permit.permitName,
        permitCategory: permitUser.permit.permitCategory.name,
        department: permitUser.permit.department.name,
        institution: permitUser.permit.institution.name,
        issueDate: formatDate(permitUser.permit.issuedDate),
        validityPeriod: permitUser.permit.validityPeriod,
        status: permitUser.permit.status,
        expireDate: formatDate(permitUser.permit.expireDate),
        description: permitUser.permit.description,
      }));
      res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  getPermitById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const permit = await prisma.permit.findUnique({
        where: { id },
        include: {
          permitCategory: true,
          department: true,
          institution: true,
          permitUser: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!permit) {
        throw new createError(404, "Permit not found");
      }

      const data = {
        id: permit.id,
        permitId: permit.permitId,
        permitNumber: permit.permitNumber,
        permitName: permit.permitName,
        permitCategory: permit.permitCategory
          ? {
              id: permit.permitCategory.id,
              name: permit.permitCategory.name,
            }
          : null,
        department: permit.department
          ? {
              id: permit.department.id,
              name: permit.department.name,
            }
          : null,
        institution: permit.institution
          ? {
              id: permit.institution.id,
              name: permit.institution.name,
            }
          : null,
        issueDate: formatDate(permit.issuedDate),
        validityPeriod: permit.validityPeriod,
        status: permit.status,
        expireDate: formatDate(permit.expireDate),
        description: permit.description,
        renewalRequirement: permit.renewalRequirement,
        notification: permit.notification,
        urlDocument: permit.urlDocument,
        preparationPeriod: permit.preparationPeriod,
        permitUsers: permit.permitUser.map((permitUser) => ({
          id: permitUser.userId,
          name: permitUser.user.name,
          permitRole: permitUser.permitRole,
        })),
      };

      res.status(200).json({ success: true, data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  createPermit: async (req, res, next) => {
    try {
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
        preparationPeriod,
        urlDocument,
        status,
        users,
      } = req.body;

      if (
        !permitCategoryId ||
        !ownerDepartmentId ||
        !institutionId ||
        !permitName ||
        !permitNumber ||
        !issuedDate ||
        !validityPeriod ||
        !expireDate ||
        !description ||
        !renewalRequirement ||
        !notification ||
        !preparationPeriod ||
        !urlDocument ||
        !status ||
        !users ||
        users.length === 0
      ) {
        throw new createError(400, "All fields are required");
      }

      const findPermit = await prisma.permit.findFirst({
        where: {
          permitName,
          deletedAt: null,
        },
      });

      if (findPermit) {
        throw new createError(409, "Permit already exists");
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
      });

      if (!department) {
        throw new createError(404, "Department not found");
      }

      let permitDetails;

      await prisma.$transaction(async (prisma) => {
        const permitId = await generatePermitId();
        const permit = await prisma.permit.create({
          data: {
            permitId,
            permitCategoryId,
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
            preparationPeriod,
            urlDocument,
            status,
          },
        });

        await prisma.permitUser.createMany({
          data: users.map((user) => ({
            userId: user.id,
            permitId: permit.id,
            permitRole: user.role,
          })),
        });

        permitDetails = {
          id: permit.id,
          permitId: permitId,
          permitName: permit.permitName,
          permitNumber: permit.permitNumber,
          permitCategory: permitCategory.name,
          institution: institution.name,
          department: department.name,
          issuedDate: formatDate(issuedDate),
          validityPeriod,
          expireDate: formatDate(expireDate),
          status,
          description: permit.description,
        };
      });

      const permitUsers = await prisma.permitUser.findMany({
        where: {
          permitId: permitDetails.id,
        },
        include: {
          user: {
            include: {
              auth: { select: { email: true } },
            },
          },
        },
      });

      const toEmails = permitUsers.map(
        (permitUser) => permitUser.user.auth.email
      );

      const adminUsers = await prisma.user.findMany({
        where: {
          role: "ADMIN",
        },
        select: {
          auth: { select: { email: true } },
        },
      });

      const ccEmails = adminUsers.map((admin) => admin.auth.email);

      await sendEmailService.sendEmail("createPermit", {
        to: toEmails,
        permitId: permitDetails.permitId,
        permitNumber: permitDetails.permitNumber,
        permitName: permitDetails.permitName,
        permitCategory: permitDetails.permitCategory,
        institution: permitDetails.institution,
        department: permitDetails.department,
        issueDate: permitDetails.issuedDate,
        validityPeriod: permitDetails.validityPeriod,
        expireDate: permitDetails.expireDate,
        status: permitDetails.status,
        description: permitDetails.description,
        cc: ccEmails,
      });

      return res
        .status(201)
        .json({ success: true, message: "Permit created successfully" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  updatePermit: async (req, res, next) => {
    try {
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
        status,
        users,
      } = req.body;

      if (
        !permitCategoryId ||
        !ownerDepartmentId ||
        !institutionId ||
        !permitName ||
        !permitNumber ||
        !issuedDate ||
        !validityPeriod ||
        !expireDate ||
        !description ||
        !status ||
        !users ||
        users.length === 0
      ) {
        throw new createError(400, "All fields are required");
      }

      const { id } = req.params;

      const findPermit = await prisma.permit.findUnique({
        where: { id: id },
      });

      if (!findPermit) {
        throw new createError(404, "Permit not found");
      }

      const permitCategory = await prisma.permitCategory.findUnique({
        where: { id: permitCategoryId },
      });

      if (!permitCategory) {
        throw new createError(404, "Permit Category not found");
      }

      const institution = await prisma.institution.findUnique({
        where: { id: institutionId },
      });

      if (!institution) {
        throw new createError(404, "Institution not found");
      }

      const department = await prisma.department.findUnique({
        where: { id: ownerDepartmentId },
      });

      if (!department) {
        throw new createError(404, "Department not found");
      }

      await prisma.$transaction(async (prisma) => {
        await prisma.permit.update({
          where: { id: id },
          data: {
            permitCategoryId,
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
            status,
          },
        });

        await prisma.permitUser.deleteMany({
          where: { permitId: id },
        });

        await prisma.permitUser.createMany({
          data: users.map((user) => ({
            permitId: id,
            userId: user.id,
            permitRole: user.role,
          })),
        });
      });

      res.status(200).json({
        success: true,
        message: "Permit updated successfully",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  deletePermit: async (req, res, next) => {
    try {
      const { id } = req.params;
      const permit = await prisma.permit.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      if (!permit) {
        throw new createError(404, "Permit not found");
      }

      await prisma.permitUser.updateMany({
        where: { permitId: id },
        data: { deletedAt: new Date() },
      });
      res.status(200).json({
        success: true,
        message: "Permit deleted successfully",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  getAllPermitDeleted: async (req, res, next) => {
    try {
      const permits = await prisma.permit.findMany({
        where: { deletedAt: { not: null } },
        include: {
          permitCategory: true,
          department: true,
          institution: true,
        },
      });
      const data = permits.map((permit) => {
        return {
          id: permit.id,
          permitId: permit.permitId,
          permitNumber: permit.permitNumber,
          permitName: permit.permitName,
          permitCategory: permit.permitCategory.name,
          department: permit.department.name,
          institution: permit.institution.name,
          issueDate: formatDate(permit.issuedDate),
          validityPeriod: permit.validityPeriod,
          status: permit.status,
          expireDate: formatDate(permit.expireDate),
          description: permit.description,
          deletedAt: formatDate(permit.deletedAt),
        };
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  getPermitDeletedByUser: async (req, res, next) => {
    try {
      const { id } = res.user;
      const permits = await prisma.permitUser.findMany({
        where: { userId: id, permit: { deletedAt: { not: null } } },
        include: {
          permit: {
            include: {
              permitCategory: true,
              department: true,
              institution: true,
            },
          },
        },
      });
      const data = permits.map((permitUser) => ({
        id: permitUser.permit.id,
        permitId: permitUser.permit.permitId,
        permitNumber: permitUser.permit.permitNumber,
        permitName: permitUser.permit.permitName,
        permitCategory: permitUser.permit.permitCategory.name,
        department: permitUser.permit.department.name,
        institution: permitUser.permit.institution.name,
        issueDate: formatDate(permitUser.permit.issuedDate),
        validityPeriod: permitUser.permit.validityPeriod,
        status: permitUser.permit.status,
        expireDate: formatDate(permitUser.permit.expireDate),
        description: permitUser.permit.description,
        deletedAt: formatDate(permitUser.permit.deletedAt),
      }));
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
