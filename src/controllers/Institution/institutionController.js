const prisma = require("../../application/database");
const { createError } = require("../../models/errorResponse");

module.exports = {
  getAllInstitution: async (req, res, next) => {
    try {
      const institution = await prisma.institution.findMany({
        where: { deletedAt: null },
      });
      if (!institution) {
        throw createError(404, "Institution not found");
      }
      return res.status(200).json({
        success: true,
        data: institution,
      });
    } catch (error) {
      next(error);
    }
  },

  getInstitutionById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const institution = await prisma.institution.findUnique({
        where: { id, deletedAt: null },
      });
      if (!institution) {
        throw createError(404, "Institution not found");
      }
      return res.status(200).json({
        success: true,
        data: institution,
      });
    } catch (error) {
      next(error);
    }
  },

  createInstitution: async (req, res, next) => {
    try {
      const { name } = req.body;
      if (!name) {
        throw createError(400, "Institution name is required");
      }
      const findInstitution = await prisma.institution.findUnique({
        where: { name, deletedAt: null },
      });
      if (findInstitution) {
        throw createError(409, "Institution already exists");
      }
      await prisma.institution.create({
        data: {
          name,
        },
      });
      return res.status(201).json({
        success: true,
        massage: "Institution created successfully",
      });
    } catch (error) {}
  },

  updateInstitution: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name) {
        throw createError(400, "Institution name is required");
      }
      const findInstitution = await prisma.institution.findUnique({
        where: { id, deletedAt: null },
      });
      if (!findInstitution) {
        throw createError(404, "Institution not found");
      }
      await prisma.institution.update({
        where: { id },
        data: {
          name,
        },
      });
      return res.status(200).json({
        success: true,
        massage: "Institution updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  deleteInstitution: async (req, res, next) => {
    try {
      const { id } = req.params;

      const findInstitution = await prisma.institution.findUnique({
        where: { id, deletedAt: null },
      });
      if (!findInstitution) {
        throw createError(404, "Institution not found");
      }
      await prisma.institution.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });
      return res.status(200).json({
        success: true,
        massage: "Institution deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
