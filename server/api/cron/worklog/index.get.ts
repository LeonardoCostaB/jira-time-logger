import prisma from '~~/server/db/prisma';

import { decrypt } from '../../../utils/encrypt';

import { registerIssueForWorklog } from './_service/issue-register';
import { isHoliday } from './_utils/is-holiday';

export type JiraWorklogs = Array<{
    companyEmail: string;
    domain: string;
    issueKey: string;
    timeSpent: number;
    error: { message: string; details: any } | null;
}>;

export default defineEventHandler(async () => {
    try {
        const userJiraAccounts = await prisma.jiraAccount.findMany({
            where: {
                active: true,
            },
            select: {
                companyEmail: true,
                companyDomain: true,
                apiToken: true,

                userId: true,

                issues: {
                    where: {
                        active: true,
                    },
                },
            },
        });

        const today = new Date();

        const isTodayHoliday = await isHoliday(today.toISOString().slice(0, 10));
        if (isTodayHoliday) {
            console.log(today.toISOString(), 'Today is a holiday. No worklogs will be logged.');

            await sendDiscordNotification(
                `Today is a holiday. No worklogs will be logged. Date: ${today.toISOString().slice(0, 10)}`,
            );

            return {
                statusCode: 200,
                message: 'Today is a holiday. No worklogs were logged.',
            };
        }

        const worklogs: JiraWorklogs = [];

        for (const userJiraAccount of userJiraAccounts) {
            const issues = userJiraAccount.issues;

            if (issues.length === 0) {
                console.error(
                    today.toISOString(),
                    `No active issues found for user ${userJiraAccount.companyEmail} in company ${userJiraAccount.companyDomain}`,
                );

                // implementar envio de email para o usuário informando que não há issues ativas para logar o worklog

                await sendDiscordNotification(
                    `No active issues found for user ${userJiraAccount.companyEmail} in company ${userJiraAccount.companyDomain}`,
                );

                continue;
            }

            const decryptedApiToken = decrypt(userJiraAccount.apiToken);
            const { worklogs: registeredWorklogs } = await registerIssueForWorklog({
                user: {
                    id: userJiraAccount.userId,
                    companyEmail: userJiraAccount.companyEmail,
                    companyDomain: userJiraAccount.companyDomain,
                    apiToken: decryptedApiToken,
                },
                issues,
            });

            worklogs.push(...registeredWorklogs);
        }

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

        console.log(
            today.toISOString(),
            `Worklog registration completed for ${worklogs.length} issues.`,
            JSON.stringify(worklogs, null, 2),
        );

        return {
            statusCode: 200,
            // message: `Worklog registration completed for ${worklogs.length} issues.`,
        };
    } catch (error) {
        console.error(new Date().toISOString(), 'Error during worklog registration:', error);

        await sendDiscordNotification(
            `Error during worklog registration: ${error instanceof Error ? error.message : String(error)}`,
        );
    }
});
