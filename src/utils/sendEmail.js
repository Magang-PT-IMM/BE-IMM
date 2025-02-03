const { sendEmail } = require("./transporter");
const emailTemplates = require("../helper/emailTemplate");

const sendEmailService = {
  sendEmail: async (emailType, emailParams) => {
    try {
      let mailOptions;

      if (emailType === "generatedPassword") {
        mailOptions = emailTemplates.generatedPassword(
          emailParams.to,
          emailParams.password,
          emailParams.name
        );
      } else if (emailType === "resetPassword") {
        mailOptions = emailTemplates.resetPassword(
          emailParams.to,
          emailParams.password,
          emailParams.name
        );
      } else if (emailType === "rememberObligation") {
        mailOptions = emailTemplates.rememberObligation(
          emailParams.to,
          emailParams.obligationId,
          emailParams.obligationName,
          emailParams.obligationType,
          emailParams.obligationCategory,
          emailParams.institution,
          emailParams.description,
          emailParams.dueDate,
          emailParams.status,
          emailParams.latestUpdate,
          emailParams.cc
        );
      } else if (emailType === "actionObligation") {
        mailOptions = emailTemplates.actionObligation(
          emailParams.to,
          emailParams.action,
          emailParams.obligationId,
          emailParams.obligationName,
          emailParams.obligationType,
          emailParams.obligationCategory,
          emailParams.institution,
          emailParams.description,
          emailParams.dueDate,
          emailParams.status,
          emailParams.cc
        );
      } else {
        throw new Error("Invalid email type");
      }
      await sendEmail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  },
};

module.exports = sendEmailService;
