/*
  Warnings:

  - You are about to drop the column `secondsPerDay` on the `jira_accounts` table. All the data in the column will be lost.
  - Added the required column `issueTime` to the `jira_accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "jira_accounts" DROP COLUMN "secondsPerDay",
ADD COLUMN     "issueTime" TEXT NOT NULL;
