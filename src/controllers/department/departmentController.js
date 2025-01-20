const prisma = require("../../application/database");
const { createError } = require("../../models/errorResponse");

module.exports = {
  getAllDepartment: async (req, res, next) => {
    try {
      const department = await prisma.department.findMany({
        where: { deletedAt: null },
      });
      if (!department) {
        throw createError(404, "Department not found");
      }
      return res.status(200).json({
        success: true,
        data: department,
      });
    } catch (error) {
      next(error);
    }
  },
  getDepartmentById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const department = await prisma.department.findUnique({
        where: { id, deletedAt: null },
      });
      if (!department) {
        throw createError(404, "Department not found");
      }
      return res.status(200).json({
        success: true,
        data: department,
      });
    } catch (error) {
      next(error);
    }
  },
  createDepartment: async (req, res, next) => {
    try {
      const { name } = req.body;
      if (!name) {
        throw createError(400, "Department name is required");
      }
      const findDepartment = await prisma.department.findFirst({
        where: { name, deletedAt: null },
      });
      if (findDepartment) {
        throw createError(409, "Department already exists");
      }
      await prisma.department.create({
        data: {
          name,
        },
      });
      return res.status(200).json({
        success: true,
        message: "Department created successfully",
      });
    } catch (error) {
      next(error);
    }
  },
  updateDepartment: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name) {
        throw createError(400, "Department name is required");
      }
      const findDepartment = await prisma.department.findUnique({
        where: { id, deletedAt: null },
      });
      if (!findDepartment) {
        throw createError(404, "Department not found");
      }
      await prisma.department.update({
        where: { id },
        data: {
          name,
        },
      });
      return res.status(200).json({
        success: true,
        message: "Department updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },
  deleteDepartment: async (req, res, next) => {
    try {
      const { id } = req.params;
      const findDepartment = await prisma.department.findUnique({
        where: { id, deletedAt: null },
      });
      if (!findDepartment) {
        throw createError(404, "Department not found");
      }
      await prisma.department.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });
      return res.status(200).json({
        success: true,
        message: "Department deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
