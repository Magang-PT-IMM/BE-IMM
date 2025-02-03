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
      const data = institution.map((institution) => {
        return {
          id: institution.id,
          name: institution.name,
        };
      });
      return res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  getInstitutionById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const idInt = parseInt(id);
      const institution = await prisma.institution.findUnique({
        where: { id: idInt, deletedAt: null },
      });
      if (!institution) {
        throw createError(404, "Institution not found");
      }
      const data = {
        id: institution.id,
        name: institution.name,
      };
      return res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  createInstitution: async (req, res, next) => {
    try {
      const { name } = req.body;
      if (!name) {
        throw createError(400, "Institution name is required");
      }
      const findInstitution = await prisma.institution.findFirst({
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
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  updateInstitution: async (req, res, next) => {
    try {
      const { id } = req.params;
      const idInt = parseInt(id);
      const { name } = req.body;
      if (!name) {
        throw createError(400, "Institution name is required");
      }
      const findInstitution = await prisma.institution.findUnique({
        where: { id: idInt, deletedAt: null },
      });
      if (!findInstitution) {
        throw createError(404, "Institution not found");
      }
      await prisma.institution.update({
        where: { id: idInt },
        data: {
          name,
        },
      });
      return res.status(200).json({
        success: true,
        massage: "Institution updated successfully",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  deleteInstitution: async (req, res, next) => {
    try {
      const { id } = req.params;
      const idInt = parseInt(id);

      const findInstitution = await prisma.institution.findUnique({
        where: { id: idInt, deletedAt: null },
      });
      if (!findInstitution) {
        throw createError(404, "Institution not found");
      }
      await prisma.institution.update({
        where: { id: idInt },
        data: {
          deletedAt: new Date(),
        },
      });
      return res.status(200).json({
        success: true,
        massage: "Institution deleted successfully",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
