const prisma = require("../../../src/application/database");
const { hashPassword } = require("../../../src/utils/hash");

const userSeed = async () => {
  const authAndUserData = [
    {
      email: "admin@gmail.com",
      password: "admin123",
      reNewPassword: false,
      user: {
        name: "admin",
        role: "ADMIN",
        departmentId: 29,
      },
    },
    {
      email: "nuralimUser@gmail.com",
      password: "nuralim123",
      reNewPassword: false,
      user: {
        name: "nuralim",
        role: "USER",
        departmentId: 29,
      },
    },
    {
      email: "nuralimER@gmail.com",
      password: "nuralim123",
      reNewPassword: false,
      user: {
        name: "nuralim",
        role: "EXTERNAL_RELATION",
        departmentId: 2,
      },
    },
    {
      email: "nuralimMG@gmail.com",
      password: "nuralim123",
      reNewPassword: false,
      user: {
        name: "nuralim",
        role: "MANAGEMENT",
        departmentId: 29,
      },
    },
  ];

  for (const authData of authAndUserData) {
    const hashedPassword = await hashPassword(authData.password);
    const authWithUser = await prisma.auth.create({
      data: {
        email: authData.email,
        password: hashedPassword,
        reNewPassword: authData.reNewPassword,
        user: {
          create: {
            name: authData.user.name,
            role: authData.user.role,
            departmentId: authData.user.departmentId,
          },
        },
      },
      include: {
        user: true,
      },
    });

    console.log(
      `Seeded user: ${authData.user.name} with email: ${authWithUser.email}`
    );
  }
};

module.exports = userSeed;
