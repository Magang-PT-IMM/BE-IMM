const { comparePassword, hashPassword } = require("../../utils/hash");
const { generateToken } = require("../../utils/jwt");
const prisma = require("../../application/database");
const { createError } = require("../../models/errorResponse");
const { randomPassword } = require("secure-random-password");
const sendEmailService = require("../../utils/sendEmail");

module.exports = {
  register: async (req, res, next) => {
    try {
      const { email, name, role } = req.body;

      const findUser = await prisma.auth.findUnique({
        where: { email, deletedAt: null },
      });

      if (findUser) {
        throw createError(409, "User already exists");
      }

      const password = randomPassword({
        length: 12,
        characters: "alphanumeric",
      });

      const hashedPassword = await hashPassword(password);

      await prisma.$transaction(async (prisma) => {
        const authUser = await prisma.auth.create({
          data: {
            email,
            password: hashedPassword,
            reNewPassword: false,
          },
        });

        const user = await prisma.user.create({
          data: {
            authId: authUser.id,
            name,
            role,
          },
        });

        return { authUser, user };
      });

      await sendEmailService.sendEmail("generatedPassword", {
        to: email,
        password,
        name,
      });

      return res.status(201).json({
        success: true,
        message:
          "User registered successfully, Please inform registered users to check email",
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const findUser = await prisma.auth.findUnique({
        where: { email, deletedAt: null },
      });

      if (!findUser) {
        throw createError(404, "User not found");
      }

      const isMatch = await comparePassword(password, findUser.password);

      if (!isMatch) {
        throw createError(401, "Your email or password is incorrect");
      }

      const user = await prisma.user.findUnique({
        where: { authId: findUser.id, deletedAt: null },
      });

      const token = generateToken({
        id: user.id,
        email: findUser.email,
        role: user.role,
      });

      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: {
          token,
          role: user.role,
          reNewPassword: findUser.reNewPassword,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  reNewPassword: async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const { id } = res.user;

      if (!currentPassword || !newPassword) {
        throw createError(
          400,
          "Current password and new password are required"
        );
      }

      if (currentPassword === newPassword) {
        throw createError(
          400,
          "Current password and new password cannot be the same"
        );
      }

      const findUser = await prisma.auth.findUnique({
        where: { id, deletedAt: null },
      });

      if (!findUser) {
        throw createError(404, "User not found");
      }

      const isMatch = await comparePassword(currentPassword, findUser.password);

      if (!isMatch) {
        throw createError(401, "Your current password is incorrect");
      }

      const hashedPassword = await hashPassword(newPassword);

      await prisma.$transaction(async (prisma) => {
        await prisma.auth.update({
          where: { id },
          data: {
            password: hashedPassword,
            reNewPassword: true,
          },
        });
      });

      return res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  changePassword: async (req, res, next) => {
    try {
      const { newPassword } = req.body;
      const { id } = res.user;

      if (!newPassword) {
        throw createError(
          400,
          "Current password and new password are required"
        );
      }

      const findUser = await prisma.auth.findUnique({
        where: { id, deletedAt: null },
      });

      if (!findUser) {
        throw createError(404, "User not found");
      }

      const isMatch = await comparePassword(newPassword, findUser.password);

      if (isMatch) {
        throw createError(
          400,
          "Current password and new password cannot be the same"
        );
      }

      const hashedPassword = await hashPassword(newPassword);

      await prisma.auth.update({
        where: { id },
        data: {
          password: hashedPassword,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
