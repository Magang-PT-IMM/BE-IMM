-- AlterTable
ALTER TABLE "progressTickets" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ticketUsers" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "tickets" ALTER COLUMN "status" DROP NOT NULL;
