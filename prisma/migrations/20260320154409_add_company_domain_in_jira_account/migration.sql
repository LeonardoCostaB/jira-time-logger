/*
  Warnings:

  - You are about to drop the column `issueKey` on the `jira_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `issueTime` on the `jira_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `jiraAccountId` on the `jira_worklog_histories` table. All the data in the column will be lost.
  - You are about to drop the column `timeSpent` on the `jira_worklog_histories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[companyEmail,companyDomain]` on the table `jira_accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[issueId,date]` on the table `jira_worklog_histories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyDomain` to the `jira_accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issueId` to the `jira_worklog_histories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondsPerDay` to the `jira_worklog_histories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "jira_worklog_histories" DROP CONSTRAINT "jira_worklog_histories_jiraAccountId_fkey";

-- DropIndex
DROP INDEX "jira_accounts_companyEmail_key";

-- DropIndex
DROP INDEX "jira_worklog_histories_jiraAccountId_date_key";

-- AlterTable
ALTER TABLE "jira_accounts" DROP COLUMN "issueKey",
DROP COLUMN "issueTime",
ADD COLUMN     "companyDomain" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "jira_worklog_histories" DROP COLUMN "jiraAccountId",
DROP COLUMN "timeSpent",
ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "issueId" TEXT NOT NULL,
ADD COLUMN     "secondsPerDay" INTEGER NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'SUCCESS';

-- CreateTable
CREATE TABLE "jira_issues" (
    "id" TEXT NOT NULL,
    "issueKey" TEXT NOT NULL,
    "issueTime" INTEGER NOT NULL,
    "totalSpentSoFar" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "jiraAccountId" TEXT NOT NULL,

    CONSTRAINT "jira_issues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jira_accounts_companyEmail_companyDomain_key" ON "jira_accounts"("companyEmail", "companyDomain");

-- CreateIndex
CREATE UNIQUE INDEX "jira_worklog_histories_issueId_date_key" ON "jira_worklog_histories"("issueId", "date");

-- AddForeignKey
ALTER TABLE "jira_issues" ADD CONSTRAINT "jira_issues_jiraAccountId_fkey" FOREIGN KEY ("jiraAccountId") REFERENCES "jira_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jira_worklog_histories" ADD CONSTRAINT "jira_worklog_histories_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "jira_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;
