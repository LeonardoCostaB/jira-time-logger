/*
  Warnings:

  - You are about to drop the `DaysOff` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DaysOff" DROP CONSTRAINT "DaysOff_holiDaysId_fkey";

-- DropTable
DROP TABLE "DaysOff";

-- CreateTable
CREATE TABLE "days_off" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "holiDaysId" INTEGER NOT NULL,

    CONSTRAINT "days_off_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "days_off" ADD CONSTRAINT "days_off_holiDaysId_fkey" FOREIGN KEY ("holiDaysId") REFERENCES "holidays"("id") ON DELETE CASCADE ON UPDATE CASCADE;
