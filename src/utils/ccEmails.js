const prisma = require("../application/database");

const getCCEmails = async (users) => {
  try {
    const userObligations = await prisma.userObligation.findMany({
      where: {
        userId: { in: users },
      },
      include: {
        user: {
          include: {
            auth: { select: { email: true } },
            department: { include: { parentDepartment: true } },
          },
        },
      },
    });

    const adminUsers = await prisma.user.findMany({
      where: {
        auth: {
          role: "ADMIN",
        },
      },
      include: {
        auth: { select: { email: true } },
      },
    });

    const headDeptEmails = await prisma.user.findMany({
      where: {
        departmentId: {
          in: userObligations
            .map((uo) => uo.user?.department?.id)
            .filter(Boolean),
        },
        auth: {
          role: "HEAD_DEPT",
        },
      },
      include: {
        auth: { select: { email: true } },
      },
    });
    const mgEmails = await prisma.user.findMany({
      where: {
        departmentId: {
          in: userObligations
            .map((uo) => uo.user?.department?.parentDepartment?.id)
            .filter(Boolean),
        },
        auth: {
          role: "MANAGEMENT",
        },
      },
      include: {
        auth: { select: { email: true } },
      },
    });

    const adminEmails = adminUsers.map((admin) => admin.auth.email);
    const headDeptEmailsList = headDeptEmails.map((head) => head.auth.email);
    const mgEmailsList = mgEmails.map((mg) => mg.auth.email);

    const ccEmails = [
      ...new Set([...adminEmails, ...headDeptEmailsList, ...mgEmailsList]),
    ];

    return ccEmails;
  } catch (error) {
    console.error("Error getting CC emails:", error);
    throw error;
  }
};

module.exports = { getCCEmails };
