/*
  Warnings:

  - The values [Valid,Expired,Invalid] on the enum `permitStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [Preparing,Submitting,Verification,Feedback,Approval,Complete,Closed] on the enum `ticketStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "permitStatus_new" AS ENUM ('VALID', 'EXPIRED', 'INVALID');
ALTER TABLE "permits" ALTER COLUMN "status" TYPE "permitStatus_new" USING ("status"::text::"permitStatus_new");
ALTER TYPE "permitStatus" RENAME TO "permitStatus_old";
ALTER TYPE "permitStatus_new" RENAME TO "permitStatus";
DROP TYPE "permitStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ticketStatus_new" AS ENUM ('PREPARING', 'SUBMITING', 'VERIFICATION', 'FEEDBACK', 'APPROVAL', 'COMPLETE', 'CLOSED');
ALTER TABLE "tickets" ALTER COLUMN "status" TYPE "ticketStatus_new" USING ("status"::text::"ticketStatus_new");
ALTER TABLE "progressTickets" ALTER COLUMN "status" TYPE "ticketStatus_new" USING ("status"::text::"ticketStatus_new");
ALTER TYPE "ticketStatus" RENAME TO "ticketStatus_old";
ALTER TYPE "ticketStatus_new" RENAME TO "ticketStatus";
DROP TYPE "ticketStatus_old";
COMMIT;
