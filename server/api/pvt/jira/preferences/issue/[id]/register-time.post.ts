import { registerIssueForWorklog } from '~~/server/api/cron/worklog/_service/issue-register';
import prisma from '~~/server/db/prisma';

export default defineEventHandler(async (event) => {
    const user = event.context.user as { sub: string };

    try {
        const { id } = event.context.params as { id: string };

        const issue = await prisma.jiraIssue.findFirst({
            where: {
                id,
                jiraAccount: {
                    userId: user.sub,
                    active: true,
                },
                active: true,
            },
            include: {
                jiraAccount: {
                    select: {
                        companyEmail: true,
                        companyDomain: true,
                        apiToken: true,
                    },
                },
            },
        });

        if (!issue) {
            throw createError({ statusCode: 404, message: 'Issue not found' });
        }
        const decryptedApiToken = decrypt(issue.jiraAccount.apiToken);
        const { worklogs } = await registerIssueForWorklog({
            user: {
                id: user.sub,
                companyEmail: issue.jiraAccount.companyEmail,
                companyDomain: issue.jiraAccount.companyDomain,
                apiToken: decryptedApiToken,
            },
            issues: [issue],
        });

        if (worklogs[0]?.error) {
            console.error(
                `Error registering worklog for issue ${issue.issueKey} of user ${issue.jiraAccount.companyEmail} in company ${issue.jiraAccount.companyDomain}: ${worklogs[0].error.message}`,
                worklogs[0].error.details,
            );

            throw createError({
                statusCode: 400,
                message: worklogs[0].error.message,
                data: worklogs[0].error,
            });
        }

        console.log(
            new Date().toISOString(),
            `Registered worklog for issue ${worklogs[0]?.issueKey} of user ${issue.jiraAccount.companyEmail} in company ${issue.jiraAccount.companyDomain}. Worklogs: ${JSON.stringify(worklogs, null, 2)}`,
        );

        return {
            statusCode: 200,
            message: `Worklog registered for issue ${worklogs[0]?.issueKey}`,
            worklogs,
        };
    } catch (error: any) {
        if (error?.statusCode === 400) {
            throw createError(error);
        }

        console.error('Error registering issue for worklog:', error);
        throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }
});
