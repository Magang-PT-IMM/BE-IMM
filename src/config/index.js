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
  GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
  GOOGLE_PRIVATE_KEY_ID: process.env.GOOGLE_PRIVATE_KEY_ID,
  GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
  GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_AUTH_URI: process.env.GOOGLE_AUTH_URI,
  GOOGLE_TOKEN_URI: process.env.GOOGLE_TOKEN_URI,
  GOOGLE_AUTH_PROVIDER_CERT_URL: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
  GOOGLE_CLIENT_CERT_URL: process.env.GOOGLE_CLIENT_CERT_URL,
  GOOGLE_UNIVERSE_DOMAIN: process.env.GOOGLE_UNIVERSE_DOMAIN,
};
