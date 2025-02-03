const prisma = require("../../application/database");

module.exports = {
  getDashboardData: async (req, res, next) => {
    try {
      const year = parseInt(req.query.year) || new Date().getFullYear();

      const months = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        monthName: new Date(year, i, 1).toLocaleString("default", {
          month: "long",
        }),
      }));
      const obligationsByCategoryPerMonthRaw = await prisma.obligation.findMany(
        {
          where: {
            deletedAt: null,
            createdAt: {
              gte: new Date(`${year}-01-01`),
              lt: new Date(`${year + 1}-01-01`),
            },
          },
          select: {
            createdAt: true,
            type: true,
          },
        }
      );

      const obligationsByCategoryPerMonth = months.map(
        ({ month, monthName }) => {
          const filteredObligations = obligationsByCategoryPerMonthRaw.filter(
            (o) => new Date(o.createdAt).getMonth() + 1 === month
          );

          const categoryCounts = filteredObligations.reduce((acc, o) => {
            acc[o.type] = (acc[o.type] || 0) + 1;
            return acc;
          }, {});

          return {
            month: monthName,
            categories: Object.entries(categoryCounts).map(([type, total]) => ({
              type,
              total,
            })),
          };
        }
      );

      const obligationsByInstitution = await prisma.obligation.groupBy({
        by: ["institutionId"],
        _count: { id: true },
        where: {
          deletedAt: null,
          createdAt: {
            gte: new Date(`${year}-01-01`),
            lt: new Date(`${year + 1}-01-01`),
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
          institution_name:
            institutions.find((inst) => inst.id === o.institutionId)?.name ||
            "Unknown",
          total: o._count.id,
        })
      );

      const obligationsByDepartment = await prisma.userObligation.groupBy({
        by: ["userId"],
        _count: { id: true },
        where: {
          deletedAt: null,
          createdAt: {
            gte: new Date(`${year}-01-01`),
            lt: new Date(`${year + 1}-01-01`),
          },
        },
      });
      console.log(obligationsByDepartment);

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

      const obligationsByDepartmentMapped = obligationsByDepartment.map((o) => {
        const user = users.find((u) => u.id === o.userId);
        const departmentName =
          departments.find((d) => d.id === user?.departmentId)?.name ||
          "Unknown";
        return { department_name: departmentName, total: o._count.id };
      });

      res.json({
        year,
        obligationsByCategoryPerMonth,
        obligationsByInstitution: obligationsByInstitutionMapped,
        obligationsByDepartment: obligationsByDepartmentMapped,
      });
    } catch (error) {
      next(error);
    }
  },
};
