/*
  Warnings:

  - Added the required column `ticketRole` to the `ticketUsers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ticketUsers" ADD COLUMN     "ticketRole" TEXT NOT NULL;
