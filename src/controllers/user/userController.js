const prisma = require("../../application/database");
const { createError } = require("../../models/errorResponse");

module.exports = {
  userProfile: async (req, res, next) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: res.user.id,
        },
        include: {
          auth: true,
          department: true,
        },
      });

      const data = {
        email: user.auth.email,
        name: user.name,
        department: user.department ? user.department.name : null,
        role: user.auth.role,
      };
      return res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  updateUserProfile: async (req, res, next) => {
    try {
      const { id } = res.user;
      const { email, name, departmentId } = req.body;

      await prisma.$transaction(async (prisma) => {
        const findUser = await prisma.user.findUnique({
          where: {
            id: id,
            deletedAt: null,
          },
          include: {
            auth: true,
          },
        });

        if (!findUser) {
          throw createError(404, "User not found");
        }

        if (email && email !== findUser.auth.email) {
          const authUser = await prisma.auth.findUnique({
            where: {
              email: email,
              deletedAt: null,
              not: {
                id: findUser.authId,
              },
            },
          });

          if (authUser) {
            throw createError(409, "Email already exists");
          }

          await prisma.auth.update({
            where: {
              id: findUser.authId,
            },
            data: {
              email: email,
            },
          });
        }

        await prisma.user.update({
          where: {
            id: findUser.id,
          },
          data: {
            name: name,
            departmentId: departmentId,
          },
        });
      });

      return res
        .status(200)
        .json({ success: true, message: "User updated successfully" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  getAllUser: async (req, res, next) => {
    try {
      const { role, id } = res.user;
      let users;

      if (role === "HEAD_DEPT") {
        const findDepartment = await prisma.user.findUnique({
          where: { id: id, deletedAt: null },
          include: { department: true },
        });

        if (!findDepartment || !findDepartment.department) {
          return res.status(404).json({
            success: false,
            message: "Department not found for this user.",
          });
        }

        users = await prisma.user.findMany({
          where: {
            departmentId: findDepartment.department.id,
            deletedAt: null,
            id: { not: id },
          },
          include: {
            auth: true,
            department: true,
          },
        });
      } else {
        users = await prisma.user.findMany({
          where: { deletedAt: null, id: { not: id } },
          include: {
            auth: true,
            department: true,
          },
        });
      }

      const data = users.map((user) => ({
        id: user.id,
        email: user.auth.email,
        name: user.name,
        department: user.department ? user.department.name : null,
        role: user.auth.role,
      }));

      return res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  getAllUserDeleted: async (req, res, next) => {
    try {
      const users = await prisma.user.findMany({
        where: {
          deletedAt: { not: null },
        },
        include: {
          auth: true,
          department: true,
        },
      });

      const data = users.map((user) => {
        return {
          id: user.id,
          email: user.auth.email,
          name: user.name,
          department: user.department ? user.department.name : null,
          role: user.role,
        };
      });
      return res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
      return res
        .status(200)
        .json({ success: true, data: "User deleted successfully" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  undeleteUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          deletedAt: null,
        },
      });
      return res
        .status(200)
        .json({ success: true, data: "User undeleted successfully" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getUserById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
        include: {
          auth: true,
          department: true,
        },
      });

      const data = {
        email: user.auth.email,
        name: user.name,
        department: user.department ? user.department.name : null,
      };
      return res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  updateUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { email, name, departmentId, role } = req.body;

      await prisma.$transaction(async (prisma) => {
        const findUser = await prisma.user.findUnique({
          where: {
            id: id,
            deletedAt: null,
          },
          include: {
            auth: true,
          },
        });

        if (!findUser) {
          throw createError(404, "User not found");
        }

        if (email && email !== findUser.auth.email) {
          const emailExists = await prisma.auth.findFirst({
            where: {
              email: email,
            },
          });

          if (emailExists) {
            throw createError(400, "Email already in use");
          }
        }

        await prisma.user.update({
          where: {
            id: findUser.id,
          },
          data: {
            name,
            departmentId,
          },
        });

        await prisma.auth.update({
          where: {
            id: findUser.auth.id,
          },
          data: {
            role,
            email: email || findUser.auth.email,
          },
        });
      });

      return res
        .status(200)
        .json({ success: true, message: "User updated successfully" });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};
