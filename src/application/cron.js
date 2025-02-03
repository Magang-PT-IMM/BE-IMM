const cron = require("node-cron");
const prisma = require("../application/database");
const sendEmailService = require("../utils/sendEmail");
const { formatDate } = require("../utils/dateFormat");
const { getCCEmails } = require("../utils/ccEmails");

async function sendObligationReminders() {
  try {
    const today = new Date();
    const dayOfMonth = today.getDate();

    let obligations;
    if (dayOfMonth === 5 || dayOfMonth === 10) {
      obligations = await prisma.obligation.findMany({
        where: { category: "MONTHLY", deletedAt: null },
        include: {
          institution: true,
          userObligations: {
            include: {
              user: { include: { auth: { select: { email: true } } } },
            },
          },
        },
      });
    } else if (dayOfMonth === 15 || dayOfMonth === 30) {
      obligations = await prisma.obligation.findMany({
        where: { category: { not: "MONTHLY" }, deletedAt: null },
        include: {
          institution: true,
          userObligations: {
            include: {
              user: { include: { auth: { select: { email: true } } } },
            },
          },
        },
      });
    } else {
      return;
    }

    for (const obligation of obligations) {
      const toEmails = obligation.userObligations.map(
        (userObligation) => userObligation.user.auth.email
      );

      const userIds = obligation.userObligations.map(
        (userObligation) => userObligation.user.id
      );
      const ccEmails = await getCCEmails(userIds);

      if (toEmails.length > 0) {
        await sendEmailService.sendEmail("rememberObligation", {
          to: toEmails,
          obligationId: obligation.id,
          obligationName: obligation.name,
          obligationType: obligation.type,
          obligationCategory: obligation.category,
          institution: obligation.institution.name,
          description: obligation.description || "No description provided",
          dueDate: formatDate(obligation.dueDate) || "N/A",
          status: obligation.status,
          latestUpdate: formatDate(obligation.latestUpdate) || "N/A",
          cc: ccEmails,
        });
      }
    }
  } catch (error) {
    console.error("Error sending obligation reminders:", error);
  }
}

async function updateOverdueStatus() {
  try {
    const today = new Date();

    await prisma.obligation.updateMany({
      where: {
        dueDate: { lt: today },
        status: { not: "OVERDUE" },
        deletedAt: null,
      },
      data: { status: "OVERDUE" },
    });

    console.log("Overdue status updated successfully.");
  } catch (error) {
    console.error("Error updating overdue status:", error);
  }
}

async function sendOverdueReminders() {
  try {
    const today = new Date();
    const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

    const overdueObligations = await prisma.obligation.findMany({
      where: {
        status: "OVERDUE",
        dueDate: { lte: twoWeeksAgo },
        OR: [{ latestReminder: null }, { latestReminder: { lt: twoWeeksAgo } }],
        deletedAt: null,
      },
      include: {
        institution: true,
        userObligations: { include: { user: { include: { auth: true } } } },
      },
    });

    for (const obligation of overdueObligations) {
      const usersId = obligation.userObligations.map((uo) => uo.user.id);
      const emails = obligation.userObligations.map((uo) => uo.user.auth.email);
      const ccEmails = await getCCEmails(usersId);

      if (emails.length > 0) {
        await sendEmailService.sendEmail("rememberObligation", {
          to: emails,
          usersId: usersId,
          obligationId: obligation.id,
          obligationName: obligation.name,
          obligationType: obligation.type,
          obligationCategory: obligation.category,
          institution: obligation.institution.name,
          description: obligation.description || "No description provided",
          dueDate: formatDate(obligation.dueDate) || "N/A",
          status: obligation.status,
          latestUpdate: formatDate(obligation.latestUpdate) || "N/A",
          cc: ccEmails,
        });

        console.log(`Overdue reminder sent to: ${emails.join(", ")}`);

        await prisma.obligation.update({
          where: { id: obligation.id },
          data: { latestReminder: new Date() },
        });
      }
    }
  } catch (error) {
    console.error("Error sending overdue reminders:", error);
  }
}

cron.schedule("* * * * *", () => {
  console.log(`Cron job running at ${new Date().toISOString()}`);
});

cron.schedule("0 0 5,10 * *", sendObligationReminders);
cron.schedule("0 0 15,30 * *", sendObligationReminders);
cron.schedule("0 0 * * *", sendOverdueReminders);
cron.schedule("0 2 * * *", updateOverdueStatus);

console.log("Cron job scheduled to run every minute.");

module.exports = cron;
