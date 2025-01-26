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

// const axios = require("axios");
// const dotenv = require("dotenv");
// dotenv.config();

// const tenantId = process.env.TENANT_ID;
// const clientId = process.env.CLIENT_ID;
// const clientSecret = process.env.CLIENT_SECRET;

// // Step 1: Get OAuth2 Token
// async function getToken() {
//   const tokenUrl = `https://login.microsoftonline.com/f8cdef31-a31e-4b4a-93e4-5f571e91255a/oauth2/v2.0/token`;
//   const params = new URLSearchParams();
//   params.append("grant_type", "client_credentials");
//   params.append("client_id", "31632530-357f-4a2a-974f-18f1e614efdf"); // Ganti dengan Client ID Anda
//   params.append("client_secret", "M8F8Q~CmjKrLqoCc~VeK~pxK24UpOKJrri2ASbh_"); // Ganti dengan Client Secret Anda
//   params.append("scope", "https://graph.microsoft.com/.default");

//   const response = await axios.post(tokenUrl, params);
//   return response.data.access_token;
// }

// // Step 2: Send Email
// async function sendEmail(accessToken) {
//   const emailUrl = "https://graph.microsoft.com/v1.0/me/sendMail";
//   const emailData = {
//     message: {
//       subject: "Test Email with HTML Content",
//       body: {
//         contentType: "HTML",
//         content: `
//           <h1>Hello, User!</h1>
//           <p>This is a <b>beautiful email</b> sent using <i>Microsoft Graph API</i>.</p>
//           <p>Here are some details:</p>
//           <ul>
//             <li><b>Date:</b> ${new Date().toLocaleDateString()}</li>
//             <li><b>Time:</b> ${new Date().toLocaleTimeString()}</li>
//           </ul>
//           <p>Visit our website: <a href="https://example.com">example.com</a></p>
//           <p>Best regards,<br>Your Team</p>
//         `,
//       },
//       toRecipients: [
//         {
//           emailAddress: {
//             address: "recipient@example.com",
//           },
//         },
//       ],
//     },
//   };

//   const response = await axios.post(emailUrl, emailData, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     },
//   });

//   console.log("Email sent successfully!");
//   return response.data;
// }

// // Main Function
// (async () => {
//   try {
//     console.log("Fetching access token...");
//     const token = await getToken();
//     console.log("Access token received. Sending email...");
//     await sendEmail(token);
//   } catch (error) {
//     console.error(
//       "Error:",
//       error.response ? error.response.data : error.message
//     );
//   }
// })();
