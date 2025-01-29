const prisma = require("../../application/database");
const { createError } = require("../../models/errorResponse");

module.exports = {
  getAllDepartment: async (req, res, next) => {
    try {
      const department = await prisma.department.findMany({
        where: { deletedAt: null },
      });
      if (!department) {
        throw new createError(404, "Department not found");
      }
      const data = department.map((department) => {
        return {
          id: department.id,
          name: department.name,
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
  getDepartmentById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const departmentId = parseInt(id);
      const department = await prisma.department.findFirst({
        where: { id: departmentId, deletedAt: null },
      });
      if (!department) {
        throw new createError(404, "Department not found");
      }
      const data = {
        id: department.id,
        name: department.name,
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
  createDepartment: async (req, res, next) => {
    try {
      const { name } = req.body;
      if (!name) {
        throw new createError(400, "Department name is required");
      }
      const findDepartment = await prisma.department.findFirst({
        where: { name, deletedAt: null },
      });
      if (findDepartment) {
        throw new createError(409, "Department already exists");
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
      console.log(error);
      next(error);
    }
  },
  updateDepartment: async (req, res, next) => {
    try {
      const { id } = req.params;
      const departmentId = parseInt(id);
      const { name } = req.body;
      if (!name) {
        throw new createError(400, "Department name is required");
      }
      const findDepartment = await prisma.department.findUnique({
        where: { id: departmentId, deletedAt: null },
      });
      if (!findDepartment) {
        throw new createError(404, "Department not found");
      }
      await prisma.department.update({
        where: { id: departmentId },
        data: {
          name,
        },
      });
      return res.status(200).json({
        success: true,
        message: "Department updated successfully",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  deleteDepartment: async (req, res, next) => {
    try {
      const { id } = req.params;
      const departmentId = parseInt(id);
      const findDepartment = await prisma.department.findUnique({
        where: { id: departmentId, deletedAt: null },
      });
      if (!findDepartment) {
        throw new createError(404, "Department not found");
      }
      await prisma.department.update({
        where: { id: departmentId },
        data: {
          deletedAt: new Date(),
        },
      });
      return res.status(200).json({
        success: true,
        message: "Department deleted successfully",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
