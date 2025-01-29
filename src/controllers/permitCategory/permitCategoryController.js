const prisma = require("../../application/database");
const { createError } = require("../../models/errorResponse");

module.exports = {
  getAllPermitCategory: async (req, res, next) => {
    try {
      const permitCategory = await prisma.permitCategory.findMany({
        where: { deletedAt: null },
      });

      if (!permitCategory) {
        throw new createError(404, "Institution not found");
      }

      const data = permitCategory.map((permitCategory) => {
        return {
          id: permitCategory.id,
          name: permitCategory.name,
        };
      });

      return res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getPermitCategoryById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const idInt = parseInt(id);
      const permitCategory = await prisma.permitCategory.findUnique({
        where: { id: idInt, deletedAt: null },
      });
      if (!permitCategory) {
        throw new createError(404, "Permit Category not found");
      }
      const data = {
        id: permitCategory.id,
        name: permitCategory.name,
      };
      return res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  createPermitCategory: async (req, res, next) => {
    try {
      const { name } = req.body;
      if (!name) {
        throw new createError(400, "Permit Category name is required");
      }
      const findPermitCategory = await prisma.permitCategory.findFirst({
        where: { name, deletedAt: null },
      });
      if (findPermitCategory) {
        throw new createError(409, "Permit Category already exists");
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
      console.log(error);
      next(error);
    }
  },

  updatePermitCategory: async (req, res, next) => {
    try {
      const { id } = req.params;
      const idInt = parseInt(id);
      const { name } = req.body;
      if (!name) {
        throw new createError(400, "Permit Category name is required");
      }
      const findPermitCategory = await prisma.permitCategory.findUnique({
        where: { id: idInt, deletedAt: null },
      });
      if (!findPermitCategory) {
        throw new createError(404, "Permit Category not found");
      }
      await prisma.permitCategory.update({
        where: { id: idInt },
        data: {
          name,
        },
      });
      return res.status(200).json({
        success: true,
        message: "Permit Category updated successfully",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  deletePermitCategory: async (req, res, next) => {
    try {
      const { id } = req.params;
      const idInt = parseInt(id);
      const findPermitCategory = await prisma.permitCategory.findUnique({
        where: { id: idInt, deletedAt: null },
      });
      if (!findPermitCategory) {
        throw new createError(404, "Permit Category not found");
      }
      await prisma.permitCategory.update({
        where: { id: idInt },
        data: {
          deletedAt: new Date(),
        },
      });
      return res.status(200).json({
        success: true,
        message: "Permit Category deleted successfully",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
