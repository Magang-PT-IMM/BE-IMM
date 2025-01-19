/*
  Warnings:

  - You are about to drop the column `role` on the `auths` table. All the data in the column will be lost.
  - The primary key for the `progressTickets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `progressTickets` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `Description` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `users` table. All the data in the column will be lost.
  - Added the required column `departmentId` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "permitStatus" AS ENUM ('Valid', 'Expired', 'Invalid');

-- AlterTable
ALTER TABLE "auths" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "progressTickets" DROP CONSTRAINT "progressTickets_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "progressTickets_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "Description",
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "department",
ADD COLUMN     "departmentId" INTEGER NOT NULL,
ADD COLUMN     "role" "actorRole" NOT NULL;

-- CreateTable
CREATE TABLE "permits" (
    "id" TEXT NOT NULL,
    "permitCategoryId" INTEGER NOT NULL,
    "ownerDepartmentId" INTEGER NOT NULL,
    "institutionId" INTEGER NOT NULL,
    "permitName" TEXT NOT NULL,
    "permitNumber" TEXT NOT NULL,
    "issuedDate" TIMESTAMP(3) NOT NULL,
    "validityPeriod" TEXT NOT NULL,
    "expireDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "renewalRequirement" TEXT NOT NULL,
    "notification" TEXT NOT NULL,
    "urlDocument" TEXT NOT NULL,
    "preparationPeriod" TEXT NOT NULL,
    "status" "permitStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permitUsers" (
    "id" SERIAL NOT NULL,
    "permitId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permitRole" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permitUsers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permits" ADD CONSTRAINT "permits_permitCategoryId_fkey" FOREIGN KEY ("permitCategoryId") REFERENCES "permitCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permits" ADD CONSTRAINT "permits_ownerDepartmentId_fkey" FOREIGN KEY ("ownerDepartmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permits" ADD CONSTRAINT "permits_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permitUsers" ADD CONSTRAINT "permitUsers_permitId_fkey" FOREIGN KEY ("permitId") REFERENCES "permits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permitUsers" ADD CONSTRAINT "permitUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
