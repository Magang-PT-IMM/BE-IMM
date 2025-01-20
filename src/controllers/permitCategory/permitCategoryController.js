const prisma = require("../../application/database");
const { createError } = require("../../models/errorResponse");

module.exports = {
  getAllPermitCategory: async (req, res, next) => {
    try {
      const permitCategory = await prisma.permitCategory.findMany({
        where: { deletedAt: null },
      });

      if (!permitCategory) {
        throw createError(404, "Institution not found");
      }

      return res.status(200).json({ success: true, data: permitCategory });
    } catch (error) {
      throw createError(500, error.message);
    }
  },
  getPermitCategoryById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const permitCategory = await prisma.permitCategory.findUnique({
        where: { id, deletedAt: null },
      });
      if (!permitCategory) {
        throw createError(404, "Permit Category not found");
      }
      return res.status(200).json({ success: true, data: permitCategory });
    } catch (error) {
      next(error);
    }
  },

  createPermitCategory: async (req, res, next) => {
    try {
      const { name } = req.body;
      if (!name) {
        throw createError(400, "Permit Category name is required");
      }
      const findPermitCategory = await prisma.permitCategory.findFirst({
        where: { name, deletedAt: null },
      });
      if (findPermitCategory) {
        throw createError(409, "Permit Category already exists");
      }
      await prisma.permitCategory.create({
        data: {
          name,
        },
      });
      return res.status(200).json({
        success: true,
        message: "Permit Category created successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  updatePermitCategory: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name) {
        throw createError(400, "Permit Category name is required");
      }
      const findPermitCategory = await prisma.permitCategory.findUnique({
        where: { id, deletedAt: null },
      });
      if (!findPermitCategory) {
        throw createError(404, "Permit Category not found");
      }
      await prisma.permitCategory.update({
        where: { id },
        data: {
          name,
        },
      });
      return res.status(200).json({
        success: true,
        message: "Permit Category updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  deletePermitCategory: async (req, res, next) => {
    try {
      const { id } = req.params;
      const findPermitCategory = await prisma.permitCategory.findUnique({
        where: { id, deletedAt: null },
      });
      if (!findPermitCategory) {
        throw createError(404, "Permit Category not found");
      }
      await prisma.permitCategory.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });
      return res.status(200).json({
        success: true,
        message: "Permit Category deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
