/*
  Warnings:

  - You are about to drop the column `activitiesId` on the `Ticket` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_activitiesId_fkey";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "activitiesId";

-- CreateTable
CREATE TABLE "_ActivityTickets" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityTickets_AB_unique" ON "_ActivityTickets"("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityTickets_B_index" ON "_ActivityTickets"("B");

-- AddForeignKey
ALTER TABLE "_ActivityTickets" ADD CONSTRAINT "_ActivityTickets_A_fkey" FOREIGN KEY ("A") REFERENCES "Activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityTickets" ADD CONSTRAINT "_ActivityTickets_B_fkey" FOREIGN KEY ("B") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
