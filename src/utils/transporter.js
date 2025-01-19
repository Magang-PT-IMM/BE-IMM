const nodemailer = require("nodemailer");
const {
  AUTH_EMAIL,
  AUTH_PASSWORD,
  NODEMAILER_SERVICE,
  NODEMAILER_HOST,
  NODEMAILER_PORT,
} = require("../config/index");

let transporter = nodemailer.createTransport({
  service: NODEMAILER_SERVICE,
  host: NODEMAILER_HOST,
  port: NODEMAILER_PORT,
  secure: false,
  // requireTLS: true,
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASSWORD,
  },
});

const sendEmail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return;
  } catch (err) {
    throw err;
  }
};

module.exports = { sendEmail };
