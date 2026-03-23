/*
  Warnings:

  - You are about to drop the column `holiDaysId` on the `days_off` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[year]` on the table `holidays` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `holidDaysYear` to the `days_off` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "days_off" DROP CONSTRAINT "days_off_holiDaysId_fkey";

-- AlterTable
ALTER TABLE "days_off" DROP COLUMN "holiDaysId",
ADD COLUMN     "holidDaysYear" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "holidays_year_key" ON "holidays"("year");

-- AddForeignKey
ALTER TABLE "days_off" ADD CONSTRAINT "days_off_holidDaysYear_fkey" FOREIGN KEY ("holidDaysYear") REFERENCES "holidays"("year") ON DELETE CASCADE ON UPDATE CASCADE;
