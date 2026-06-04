/*
  Warnings:

  - Made the column `statusId` on table `appointments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_statusId_fkey";

-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "statusId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "appointment_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
