const prisma = require("../../application/database");

module.exports = {
  getObligationsByMonth: async (req, res, next) => {
    try {
      const year = parseInt(req.query.year) || new Date().getFullYear();
      const typeFilter = req.query.type;

      const months = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        monthName: new Date(year, i, 1).toLocaleString("default", {
          month: "long",
        }),
      }));

      const obligationsRaw = await prisma.obligation.findMany({
        where: {
          deletedAt: null,
          createdAt: {
            gte: new Date(`${year}-01-01`),
            lt: new Date(`${year + 1}-01-01`),
          },
          status: { in: ["PROCESS", "COMPLETE"] },
          ...(typeFilter ? { type: typeFilter } : {}),
        },
        select: {
          createdAt: true,
          status: true,
          itsOverdue: true,
          type: true,
        },
      });

      const obligationsByMonth = months.map(({ month, monthName }) => {
        const filteredObligations = obligationsRaw.filter(
          (o) => new Date(o.createdAt).getMonth() + 1 === month
        );

        const statusOverdueCounts = {
          PROCESS: { overdue: 0, notOverdue: 0 },
          COMPLETE: { overdue: 0, notOverdue: 0 },
        };

        filteredObligations.forEach((o) => {
          if (o.status === "PROCESS") {
            o.itsOverdue
              ? statusOverdueCounts.PROCESS.overdue++
              : statusOverdueCounts.PROCESS.notOverdue++;
          } else if (o.status === "COMPLETE") {
            o.itsOverdue
              ? statusOverdueCounts.COMPLETE.overdue++
              : statusOverdueCounts.COMPLETE.notOverdue++;
          }
        });

        return {
          month: monthName,
          data: {
            PROCESS: {
              overdue: statusOverdueCounts.PROCESS.overdue,
              notOverdue: statusOverdueCounts.PROCESS.notOverdue,
            },
            COMPLETE: {
              overdue: statusOverdueCounts.COMPLETE.overdue,
              notOverdue: statusOverdueCounts.COMPLETE.notOverdue,
            },
          },
        };
      });

      res.json({
        year,
        type: typeFilter || "All Types",
        obligationsByMonth,
      });
    } catch (error) {
      next(error);
    }
  },
  getObligationsByInstitution: async (req, res, next) => {
    try {
      const { institutionId, month, year } = req.query;
      const selectedYear = parseInt(year) || new Date().getFullYear();
      const selectedMonth = parseInt(month);

      if (!institutionId) {
        const obligationsByInstitution = await prisma.obligation.groupBy({
          by: ["institutionId"],
          _count: { id: true },
          where: {
            deletedAt: null,
            createdAt: {
              gte: new Date(`${selectedYear}-01-01`),
              lt: new Date(`${selectedYear + 1}-01-01`),
            },
          },
        });

        const institutions = await prisma.institution.findMany({
          where: {
            id: { in: obligationsByInstitution.map((o) => o.institutionId) },
          },
          select: { id: true, name: true },
        });

        const obligationsByInstitutionMapped = obligationsByInstitution.map(
          (o) => ({
            institution_id: o.institutionId,
            institution_name:
              institutions.find((inst) => inst.id === o.institutionId)?.name ||
              "Unknown",
            total: o._count.id,
          })
        );

        return res.json({
          year: selectedYear,
          obligationsByInstitution: obligationsByInstitutionMapped,
        });
      }

      const whereCondition = {
        deletedAt: null,
        institutionId,
        createdAt: {
          gte: new Date(`${selectedYear}-01-01`),
          lt: new Date(`${selectedYear + 1}-01-01`),
        },
        status: { in: ["PROCESS", "COMPLETE"] },
      };

      if (selectedMonth) {
        whereCondition.createdAt.gte = new Date(
          `${selectedYear}-${selectedMonth}-01`
        );
        whereCondition.createdAt.lt = new Date(
          `${selectedYear}-${selectedMonth + 1}-01`
        );
      }

      const obligations = await prisma.obligation.findMany({
        where: whereCondition,
        select: {
          status: true,
          itsOverdue: true,
        },
      });

      const statusOverdueCounts = {
        PROCESS: { overdue: 0, notOverdue: 0 },
        COMPLETE: { overdue: 0, notOverdue: 0 },
      };

      obligations.forEach((o) => {
        if (o.status === "PROCESS") {
          o.itsOverdue
            ? statusOverdueCounts.PROCESS.overdue++
            : statusOverdueCounts.PROCESS.notOverdue++;
        } else if (o.status === "COMPLETE") {
          o.itsOverdue
            ? statusOverdueCounts.COMPLETE.overdue++
            : statusOverdueCounts.COMPLETE.notOverdue++;
        }
      });

      const institution = await prisma.institution.findUnique({
        where: { id: institutionId },
        select: { name: true },
      });

      res.json({
        year: selectedYear,
        month: selectedMonth || "All Months",
        institution: institution?.name || "Unknown",
        data: statusOverdueCounts,
      });
    } catch (error) {
      next(error);
    }
  },
  getObligationsByDepartment: async (req, res, next) => {
    try {
      const { departmentId, month, year } = req.query;
      const selectedYear = parseInt(year) || new Date().getFullYear();
      const selectedMonth = parseInt(month);

      if (!departmentId) {
        const obligationsByDepartment = await prisma.userObligation.groupBy({
          by: ["userId"],
          _count: { id: true },
          where: {
            deletedAt: null,
            obligation: {
              createdAt: {
                gte: new Date(`${selectedYear}-01-01`),
                lt: new Date(`${selectedYear + 1}-01-01`),
              },
            },
          },
        });

        const users = await prisma.user.findMany({
          where: {
            id: { in: obligationsByDepartment.map((o) => o.userId) },
          },
          select: { id: true, departmentId: true },
        });

        const departments = await prisma.department.findMany({
          where: {
            id: { in: users.map((user) => user.departmentId).filter(Boolean) },
          },
          select: { id: true, name: true },
        });

        const obligationsByDepartmentMapped = obligationsByDepartment.map(
          (o) => {
            const user = users.find((u) => u.id === o.userId);
            const departmentName =
              departments.find((d) => d.id === user?.departmentId)?.name ||
              "Unknown";
            return {
              department_id: user?.departmentId || "Unknown",
              department_name: departmentName,
              total: o._count.id,
            };
          }
        );

        return res.json({
          year: selectedYear,
          obligationsByDepartment: obligationsByDepartmentMapped,
        });
      }

      const whereCondition = {
        deletedAt: null,
        user: {
          departmentId,
        },
        obligation: {
          createdAt: {
            gte: new Date(`${selectedYear}-01-01`),
            lt: new Date(`${selectedYear + 1}-01-01`),
          },
          status: { in: ["PROCESS", "COMPLETE"] },
        },
      };

      if (selectedMonth) {
        whereCondition.obligation.createdAt.gte = new Date(
          `${selectedYear}-${selectedMonth}-01`
        );
        whereCondition.obligation.createdAt.lt = new Date(
          `${selectedYear}-${selectedMonth + 1}-01`
        );
      }

      const obligations = await prisma.userObligation.findMany({
        where: whereCondition,
        include: {
          obligation: {
            select: {
              status: true,
              itsOverdue: true,
            },
          },
        },
      });

      const statusOverdueCounts = {
        PROCESS: { overdue: 0, notOverdue: 0 },
        COMPLETE: { overdue: 0, notOverdue: 0 },
      };

      obligations.forEach((o) => {
        if (o.obligation.status === "PROCESS") {
          o.obligation.itsOverdue
            ? statusOverdueCounts.PROCESS.overdue++
            : statusOverdueCounts.PROCESS.notOverdue++;
        } else if (o.obligation.status === "COMPLETE") {
          o.obligation.itsOverdue
            ? statusOverdueCounts.COMPLETE.overdue++
            : statusOverdueCounts.COMPLETE.notOverdue++;
        }
      });

      const department = await prisma.department.findUnique({
        where: { id: departmentId },
        select: { name: true },
      });

      res.json({
        year: selectedYear,
        month: selectedMonth || "All Months",
        department: department?.name || "Unknown",
        data: statusOverdueCounts,
      });
    } catch (error) {
      next(error);
    }
  },
};
