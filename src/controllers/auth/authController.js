const { comparePassword, hashPassword } = require("../../utils/hash");
const { generateToken } = require("../../utils/jwt");
const prisma = require("../../application/database");
const { createError } = require("../../models/errorResponse");
const { randomPassword } = require("secure-random-password");
const sendEmailService = require("../../utils/sendEmail");

module.exports = {
  register: async (req, res, next) => {
    try {
    } catch (error) {}
  },
};
