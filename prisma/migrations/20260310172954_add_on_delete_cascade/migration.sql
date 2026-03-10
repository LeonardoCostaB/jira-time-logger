-- DropForeignKey
ALTER TABLE "jira_accounts" DROP CONSTRAINT "jira_accounts_userId_fkey";

-- DropForeignKey
ALTER TABLE "jira_worklog_histories" DROP CONSTRAINT "jira_worklog_histories_jiraAccountId_fkey";

-- AddForeignKey
ALTER TABLE "jira_accounts" ADD CONSTRAINT "jira_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jira_worklog_histories" ADD CONSTRAINT "jira_worklog_histories_jiraAccountId_fkey" FOREIGN KEY ("jiraAccountId") REFERENCES "jira_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
