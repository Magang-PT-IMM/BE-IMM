const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  SALT_SECRET: process.env.SALT_SECRET,
  AUTH_EMAIL: process.env.AUTH_EMAIL,
  AUTH_PASSWORD: process.env.AUTH_PASSWORD,
  NODEMAILER_SERVICE: process.env.NODEMAILER_SERVICE,
  NODEMAILER_HOST: process.env.NODEMAILER_HOST,
  NODEMAILER_PORT: process.env.NODEMAILER_PORT,
};
