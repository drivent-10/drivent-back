-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_activitiesId_fkey";

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "activitiesId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_activitiesId_fkey" FOREIGN KEY ("activitiesId") REFERENCES "Activities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
