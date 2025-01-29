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
        department: user.department.name,
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
          throw new createError(404, "User not found");
        }

        if (email && email !== findUser.auth.email) {
          const authUser = await prisma.auth.findUnique({
            where: {
              email: email,
              deletedAt: null,
            },
          });

          if (authUser) {
            throw new createError(409, "Email already exists");
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
      const users = await prisma.user.findMany({
        where: {
          deletedAt: null,
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
          department: user.department.name,
          role: user.role,
        };
      });
      return res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.log(error);
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
          department: user.department.name,
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
        department: user.department.name,
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
          throw new createError(404, "User not found");
        }

        await prisma.user.update({
          where: {
            id: findUser.id,
          },
          data: {
            name: name,
            role: role,
            departmentId: departmentId,
          },
        });
        if (email && email !== findUser.auth.email) {
          const emailExists = await prisma.auth.findUnique({
            where: {
              email: email,
            },
          });

          if (emailExists) {
            throw new createError(400, "Email already in use");
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
      });

      return res
        .status(200)
        .json({ success: true, message: "User updated successfully" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
