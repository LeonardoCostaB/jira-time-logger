/*
  Warnings:

  - A unique constraint covering the columns `[companyEmail]` on the table `jira_accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "jira_worklog_histories" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timeSpent" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jiraAccountId" TEXT NOT NULL,

    CONSTRAINT "jira_worklog_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jira_worklog_histories_jiraAccountId_date_key" ON "jira_worklog_histories"("jiraAccountId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "jira_accounts_companyEmail_key" ON "jira_accounts"("companyEmail");

-- AddForeignKey
ALTER TABLE "jira_worklog_histories" ADD CONSTRAINT "jira_worklog_histories_jiraAccountId_fkey" FOREIGN KEY ("jiraAccountId") REFERENCES "jira_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
