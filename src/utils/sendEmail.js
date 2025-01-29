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
      } else if (emailType === "createTicket") {
        mailOptions = emailTemplates.createTicket(
          emailParams.to,
          emailParams.ticketId,
          emailParams.department,
          emailParams.permitName,
          emailParams.permitCategory,
          emailParams.institution,
          emailParams.externalRelation,
          emailParams.description,
          emailParams.cc
        );
      } else if (emailType === "resetPassword") {
        mailOptions = emailTemplates.resetPassword(
          emailParams.to,
          emailParams.password,
          emailParams.name
        );
      } else if (emailType === "rememberNotification") {
        mailOptions = emailTemplates.rememberNotification(
          emailParams.to,
          emailParams.ticketId,
          emailParams.name,
          emailParams.permitName,
          emailParams.lastStatus,
          emailParams.lastStatusDescription,
          emailParams.lastUpdate,
          emailParams.lastUpdateBy,
          emailParams.cc
        );
      } else if (emailType === "createPermit") {
        mailOptions = emailTemplates.createPermit(
          emailParams.to,
          emailParams.permitId,
          emailParams.permitNumber,
          emailParams.permitName,
          emailParams.permitCategory,
          emailParams.institution,
          emailParams.department,
          emailParams.issueDate,
          emailParams.validityPeriod,
          emailParams.expireDate,
          emailParams.status,
          emailParams.description,
          emailParams.cc
        );
      } else if (emailType === "updatePermit") {
        mailOptions = emailTemplates.updatePermit(
          emailParams.to,
          emailParams.permitId,
          emailParams.permitNumber,
          emailParams.permitName,
          emailParams.permitCategory,
          emailParams.institution,
          emailParams.department,
          emailParams.issueDate,
          emailParams.validityPeriod,
          emailParams.expireDate,
          emailParams.status,
          emailParams.description,
          emailParams.cc
        );
      } else if (emailType === "updateTicket") {
        mailOptions = emailTemplates.updateTicket(
          emailParams.to,
          emailParams.ticketId,
          emailParams.department,
          emailParams.permitName,
          emailParams.permitCategory,
          emailParams.institution,
          emailParams.description,
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
