const { comparePassword, hashPassword } = require("../../utils/hash");
const { generateToken } = require("../../utils/jwt");
const prisma = require("../../application/database");
const { createError } = require("../../models/errorResponse");
const { randomPassword } = require("secure-random-password");
const sendEmailService = require("../../utils/sendEmail");

const authService = {
  login: async (email, password) => {
    const findUser = await prisma.auth.findUnique({
      where: { email, deletedAt: null },
    });

    if (!findUser) {
      throw createError(404, "User not found");
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      throw createError(401, "Invalid credentials");
    }

    const user = await prisma.user.findUnique({
      where: { authId: findUser.id, deletedAt: null },
    });

    const token = generateToken({
      id: user.id,
      email: findUser.email,
      role: user.role,
    });

    return {
      token,
      role: user.role,
      reNewPassword: findUser.reNewPassword,
    };
  },

  register: async (email, name, role) => {
    const findUser = await prisma.auth.findUnique({
      where: { email, deletedAt: null },
    });

    if (findUser) {
      throw createError(409, "User already exists");
    }

    const password = randomPassword({ length: 12, characters: "alphanumeric" });

    const hashedPassword = await hashPassword(password);

    const authUser = await prisma.auth.create({
      data: {
        email,
        password: hashedPassword,
        reNewPassword: false,
      },
    });

    await prisma.user.create({
      data: {
        authId: authUser.id,
        name,
        role,
      },
    });

    await sendEmailService.sendEmail("generatedPassword", {
      to: email,
      password,
    });
  },
};

module.exports = authService;
