/*
  Warnings:

  - A unique constraint covering the columns `[issueKey,jiraAccountId]` on the table `jira_issues` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "jira_issues_issueKey_jiraAccountId_key" ON "jira_issues"("issueKey", "jiraAccountId");
