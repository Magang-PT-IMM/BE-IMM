const prisma = require("../../application/database");
const { createError } = require("../../models/errorResponse");

module.exports = {
  getAllDepartment: async (req, res, next) => {
    try {
      const department = await prisma.department.findMany({
        where: { deletedAt: null },
        include: {
          parentDepartment: true,
          subDepartments: true,
        },
      });
      if (!department) {
        throw createError(404, "Department not found");
      }
      const data = department.map((departments) => ({
        id: departments.id,
        name: departments.name,
        parentDepartment: departments.parentDepartment
          ? {
              id: departments.parentDepartment.id,
              name: departments.parentDepartment.name,
            }
          : null,
        subDepartments: departments.subDepartments.map((sub) => ({
          id: sub.id,
          name: sub.name,
        })),
      }));
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
      const department = await prisma.department.findFirst({
        where: { id, deletedAt: null },
        include: {
          parentDepartment: true,
        },
      });
      if (!department) {
        throw createError(404, "Department not found");
      }
      const data = {
        id: department.id,
        name: department.name,
        parentDepartment: department.parentDepartment
          ? department.parentDepartment.name
          : null,
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
      const { name, parentDepartmentId } = req.body;
      console.log(name, parentDepartmentId);
      if (!name) {
        throw createError(400, "Department name is required");
      }
      const findDepartment = await prisma.department.findFirst({
        where: { name, deletedAt: null },
      });
      if (findDepartment) {
        throw createError(409, "Department already exists");
      }
      let parentDepartment = null;
      if (parentDepartmentId) {
        parentDepartment = await prisma.department.findUnique({
          where: { id: parentDepartmentId },
        });

        if (!parentDepartment) {
          throw createError(404, "Parent department not found");
        }
      }
      await prisma.department.create({
        data: {
          name,
          parentDepartmentId: parentDepartment ? parentDepartment.id : null,
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
      const { name, parentDepartmentId } = req.body;
      console.log(name, parentDepartmentId);
      if (!name) {
        throw createError(400, "Department name is required");
      }
      const findDepartment = await prisma.department.findUnique({
        where: { id, deletedAt: null },
      });
      if (!findDepartment) {
        throw createError(404, "Department not found");
      }
      let parentDepartment = null;
      if (parentDepartmentId) {
        parentDepartment = await prisma.department.findUnique({
          where: { id: parentDepartmentId },
        });

        if (!parentDepartment) {
          throw createError(404, "Parent department not found");
        }

        if (parentDepartment.id === id) {
          throw createError(400, "Department cannot be its own parent");
        }
      }
      await prisma.department.update({
        where: { id },
        data: {
          name,
          parentDepartmentId: parentDepartment ? parentDepartment.id : null,
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
      console.log(error);
      next(error);
    }
  },
};
