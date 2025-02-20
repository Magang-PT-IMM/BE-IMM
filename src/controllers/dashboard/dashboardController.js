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

      let startDate = new Date(`${selectedYear}-01-01`);
      let endDate = new Date(`${selectedYear + 1}-01-01`);

      if (selectedMonth) {
        startDate = new Date(
          `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`
        );
        endDate = new Date(
          `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-01`
        );
      }

      if (!institutionId) {
        const obligationsByInstitutionRaw =
          await prisma.userObligation.findMany({
            where: {
              deletedAt: null,
              obligation: {
                institutionId: { not: null },
                createdAt: {
                  gte: startDate,
                  lt: endDate,
                },
              },
            },
            select: { obligationId: true },
          });

        const uniqueObligationIds = [
          ...new Set(obligationsByInstitutionRaw.map((o) => o.obligationId)),
        ];

        const obligations = await prisma.obligation.findMany({
          where: {
            id: { in: uniqueObligationIds },
          },
          select: { id: true, institutionId: true },
        });

        const institutions = await prisma.institution.findMany({
          where: {
            id: {
              in: obligations
                .map((obligation) => obligation.institutionId)
                .filter(Boolean),
            },
          },
          select: { id: true, name: true },
        });

        const obligationsByInstitutionMapped = obligations.reduce(
          (acc, obligation) => {
            if (!obligation.institutionId) return acc;

            const institution = institutions.find(
              (d) => d.id === obligation.institutionId
            );
            const institutionName = institution ? institution.name : "Unknown";

            const existing = acc.find(
              (item) => item.institution_id === obligation.institutionId
            );
            if (existing) {
              existing.total += 1;
            } else {
              acc.push({
                institution_id: obligation.institutionId,
                institution_name: institutionName,
                total: 1,
              });
            }
            return acc;
          },
          []
        );

        return res.json({
          year: selectedYear,
          month: selectedMonth || "All Months",
          obligationsByInstitution: obligationsByInstitutionMapped,
        });
      }

      const whereCondition = {
        deletedAt: null,
        obligation: {
          institutionId,
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

      let startDate = new Date(`${selectedYear}-01-01`);
      let endDate = new Date(`${selectedYear + 1}-01-01`);

      if (selectedMonth) {
        startDate = new Date(
          `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`
        );
        endDate = new Date(
          `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-01`
        );
      }

      if (!departmentId) {
        const obligationsByDepartmentRaw = await prisma.userObligation.findMany(
          {
            where: {
              deletedAt: null,
              obligation: {
                createdAt: {
                  gte: startDate,
                  lt: endDate,
                },
              },
            },
            select: {
              user: {
                select: { id: true, departmentId: true },
              },
              obligationId: true,
            },
          }
        );

        console.log(obligationsByDepartmentRaw);

        const uniqueDepartmentObligations = [
          ...new Set(
            obligationsByDepartmentRaw.map(
              (o) => `${o.user.departmentId}-${o.obligationId}`
            )
          ),
        ];

        console.log(uniqueDepartmentObligations);

        const departments = await prisma.department.findMany({
          where: {
            id: {
              in: obligationsByDepartmentRaw
                .map((o) => o.user.departmentId)
                .filter(Boolean),
            },
          },
          select: { id: true, name: true },
        });

        const obligationsByDepartmentMapped = departments.map((department) => {
          const totalObligations = uniqueDepartmentObligations.filter((uo) =>
            uo.startsWith(department.id)
          ).length;

          return {
            department_id: department.id,
            department_name: department.name,
            total: totalObligations,
          };
        });

        return res.json({
          year: selectedYear,
          month: selectedMonth || "All Months",
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
            gte: startDate,
            lt: endDate,
          },
          status: { in: ["PROCESS", "COMPLETE"] },
        },
      };

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
