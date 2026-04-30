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

            await sendDiscordNotification(
                `Suas horas não foram registradas para issue **${worklogs[0].issueKey}** do usuário **${worklogs[0].companyEmail}**.\n\nErro: ${worklogs[0].error.message}`,
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

        await sendDiscordNotification(
            worklogs
                .map((worklog) => {
                    if (worklog.error) {
                        return `Suas horas não foram registradas para issue **${worklog.issueKey}** do usuário **${worklog.companyEmail}**.\n\nErro: ${worklog.error.message}`;
                    }

                    return `Horas registradas para issue **${worklog.issueKey}** do usuário **${worklog.companyEmail}**.\nTempo gasto: **${worklog.timeSpent}** segundos.\nEmpresa: **${worklog.domain}**`;
                })
                .join('\n'),
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
