/*
  Warnings:

  - You are about to drop the column `date` on the `holidays` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `holidays` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `holidays` table. All the data in the column will be lost.
  - Added the required column `year` to the `holidays` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "holidays" DROP COLUMN "date",
DROP COLUMN "name",
DROP COLUMN "type",
ADD COLUMN     "year" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "DaysOff" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "holiDaysId" INTEGER NOT NULL,

    CONSTRAINT "DaysOff_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DaysOff" ADD CONSTRAINT "DaysOff_holiDaysId_fkey" FOREIGN KEY ("holiDaysId") REFERENCES "holidays"("id") ON DELETE CASCADE ON UPDATE CASCADE;
