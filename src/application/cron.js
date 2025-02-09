const cron = require("node-cron");
const prisma = require("../application/database");
const sendEmailService = require("../utils/sendEmail");
const { formatDate } = require("../utils/dateFormat");
const { getCCEmails } = require("../utils/ccEmails");
const fs = require("fs").promises;
const path = require("path");

// async function sendObligationReminders() {
//   try {
//     console.log("Sending obligation reminders...");
//     const today = new Date();
//     const dayOfMonth = today.getDate();

//     let obligations;
//     if (dayOfMonth === 5 || dayOfMonth === 10) {
//       obligations = await prisma.obligation.findMany({
//         where: {
//           category: "MONTHLY",
//           deletedAt: null,
//           status: {
//             notIn: ["COMPLETE"],
//           },
//         },
//         include: {
//           institution: true,
//           userObligations: {
//             include: {
//               user: { include: { auth: { select: { email: true } } } },
//             },
//           },
//         },
//       });
//     } else if (dayOfMonth === 15 || dayOfMonth === 30) {
//       obligations = await prisma.obligation.findMany({
//         where: {
//           category: { not: "MONTHLY" },
//           deletedAt: null,
//           status: {
//             notIn: ["COMPLETE"],
//           },
//         },
//         include: {
//           institution: true,
//           userObligations: {
//             include: {
//               user: { include: { auth: { select: { email: true } } } },
//             },
//           },
//         },
//       });
//     } else {
//       return;
//     }

//     for (const obligation of obligations) {
//       const toEmails = obligation.userObligations.map(
//         (userObligation) => userObligation.user.auth.email
//       );

//       const userIds = obligation.userObligations.map(
//         (userObligation) => userObligation.user.id
//       );
//       const ccEmails = await getCCEmails(userIds);

//       const overdueStatus = obligation.itsOverdue ? "Overdue" : "On Time";

//       if (toEmails.length > 0) {
//         await sendEmailService.sendEmail("rememberObligation", {
//           to: toEmails,
//           obligationId: obligation.id,
//           obligationName: obligation.name,
//           obligationType: obligation.type,
//           obligationCategory: obligation.category,
//           institution: obligation.institution.name,
//           description: obligation.description || "No description provided",
//           dueDate: obligation.dueDate ? formatDate(obligation.dueDate) : null,
//           status: `${obligation.status} : ${overdueStatus}`,
//           latestUpdate: obligation.latestUpdate
//             ? formatDate(obligation.latestUpdate)
//             : null,
//           cc: ccEmails,
//         });
//       }
//     }
//   } catch (error) {
//     console.error("Error sending obligation reminders:", error);
//   }
// }

// async function updateOverdueStatus() {
//   try {
//     console.log("Updating overdue status...");
//     const today = new Date();

//     const updatedObligations = await prisma.obligation.updateMany({
//       where: {
//         dueDate: { lt: today },
//         itsOverdue: false,
//         deletedAt: null,
//       },
//       data: { itsOverdue: true, latestRemember: new Date() },
//     });

//     console.log(`Updated ${updatedObligations.count} obligations to OVERDUE.`);

//     if (updatedObligations.count > 0) {
//       const overdueObligations = await prisma.obligation.findMany({
//         where: {
//           dueDate: { lt: today },
//           itsOverdue: true,
//           deletedAt: null,
//         },
//         include: {
//           institution: true,
//           userObligations: { include: { user: { include: { auth: true } } } },
//         },
//       });

//       for (const obligation of overdueObligations) {
//         const userIds = obligation.userObligations.map((uo) => uo.user.id);
//         const toEmails = obligation.userObligations.map(
//           (uo) => uo.user.auth.email
//         );
//         const ccEmails = await getCCEmails(userIds);

//         const overdueStatus = obligation.itsOverdue ? "Overdue" : "On Time";

//         if (toEmails.length > 0) {
//           await sendEmailService.sendEmail("rememberObligation", {
//             to: toEmails,
//             usersId: userIds,
//             obligationId: obligation.id,
//             obligationName: obligation.name,
//             obligationType: obligation.type,
//             obligationCategory: obligation.category,
//             institution: obligation.institution.name,
//             description: obligation.description || "No description provided",
//             dueDate: obligation.dueDate ? formatDate(obligation.dueDate) : null,
//             status: `${obligation.status} : ${overdueStatus}`,
//             latestUpdate: obligation.latestUpdate
//               ? formatDate(obligation.latestUpdate)
//               : null,
//             cc: ccEmails,
//           });

//           console.log(`Overdue notification sent to: ${toEmails.join(", ")}`);
//         }
//       }
//     }
//   } catch (error) {
//     console.error(
//       "Error updating overdue status and sending notifications:",
//       error
//     );
//   }
// }

// async function sendOverdueReminders() {
//   try {
//     console.log("Sending overdue reminders...");

//     const overdueObligations = await prisma.obligation.findMany({
//       where: {
//         itsOverdue: true,
//         deletedAt: null,
//       },
//       include: {
//         institution: true,
//         userObligations: { include: { user: { include: { auth: true } } } },
//       },
//     });

//     for (const obligation of overdueObligations) {
//       const now = new Date();
//       const twoWeeksAgo = new Date();
//       twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

//       console.log("Current time:", now);
//       console.log("Two Weeks ago:", twoWeeksAgo);
//       console.log("Obligation due date:", obligation.dueDate);

//       if (
//         obligation.dueDate <= now &&
//         (obligation.latestRemember === null ||
//           obligation.latestRemember < twoWeeksAgo)
//       ) {
//         const usersId = obligation.userObligations.map((uo) => uo.user.id);
//         const emails = obligation.userObligations.map(
//           (uo) => uo.user.auth.email
//         );
//         const ccEmails = await getCCEmails(usersId);

//         console.log("Sending email to:", emails);
//         console.log("CC:", ccEmails);

//         const overdueStatus = obligation.itsOverdue ? "Overdue" : "On Time";

//         if (emails.length > 0) {
//           await sendEmailService.sendEmail("rememberObligation", {
//             to: emails,
//             usersId: usersId,
//             obligationId: obligation.id,
//             obligationName: obligation.name,
//             obligationType: obligation.type,
//             obligationCategory: obligation.category,
//             institution: obligation.institution.name,
//             description: obligation.description || "No description provided",
//             dueDate: obligation.dueDate ? formatDate(obligation.dueDate) : null,
//             status: `${obligation.status} : ${overdueStatus}`,
//             latestUpdate: obligation.latestUpdate
//               ? formatDate(obligation.latestUpdate)
//               : null,
//             cc: ccEmails,
//           });

//           console.log(`Overdue reminder sent to: ${emails.join(", ")}`);

//           await prisma.obligation.update({
//             where: { id: obligation.id },
//             data: { latestRemember: new Date() },
//           });
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error sending overdue reminders:", error);
//   }
// }

// const folderPath = path.join(__dirname, "../../uploads");
// const logFilePath = path.join(__dirname, "../../combined.log");
// const maxAge = 7 * 24 * 60 * 60 * 1000;

// async function cleanUpFiles() {
//   try {
//     const files = await fs.readdir(folderPath);
//     const now = Date.now();

//     for (const file of files) {
//       const filePath = path.join(folderPath, file);
//       const stats = await fs.stat(filePath);
//       const fileAge = now - stats.mtimeMs;

//       if (fileAge > maxAge) {
//         await fs.unlink(filePath);
//         console.log(`Deleted old file: ${filePath}`);
//       }
//     }

//     console.log("Old files deleted successfully.");

//     await fs.writeFile(logFilePath, "");
//     console.log(`Cleared contents of: ${logFilePath}`);
//   } catch (error) {
//     console.error("Error during cleanup:", error);
//   }
// }
// cron.schedule("0 0 20 * *", cleanUpFiles);

// cron.schedule("0 */5 * * *", sendObligationReminders);
// cron.schedule("*/1 * * * *", sendOverdueReminders);
// cron.schedule("*/2 * * * *", updateOverdueStatus);

cron.schedule("* * * * *", () => {
  console.log(`Cron job running at ${new Date().toISOString()}`);
});

console.log("Cron job scheduled to run every minute.");

module.exports = cron;
