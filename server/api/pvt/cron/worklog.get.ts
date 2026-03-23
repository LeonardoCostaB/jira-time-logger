import prismaService from '~~/server/db/prisma';

import { isSameDay } from '../jira/utils/day-compare';
import { decrypt } from '../jira/utils/encrypt';

import { isHoliday } from './utils/is-holiday';

export default defineEventHandler(async (event) => {
    const user = event.context.user as { sub: string; email: string };

    const userJiraAccount = await prismaService.jiraAccount.findFirst({
        where: { userId: user.sub },
        select: {
            id: true,
            companyEmail: true,
            companyDomain: true,
            active: true,
            apiToken: true,
            issues: true,
        },
    });

    if (!userJiraAccount) {
        console.error(`Jira account not found for user ${user.email}`);

        throw createError({
            statusCode: 404,
            message: `Jira account not found for user ${user.email}`,
        });
    }

    if (!userJiraAccount.active) {
        console.error(`Jira account is not active for user ${userJiraAccount.companyEmail}`);

        throw createError({
            statusCode: 403,
            message: `Jira account is not active for user ${userJiraAccount.companyEmail}`,
        });
    }

    const today = new Date();

    const isTodayHoliday = await isHoliday(today.toISOString().slice(0, 10));
    if (isTodayHoliday) {
        console.log(`Today is a holiday. No worklogs will be logged for user ${user.sub}`);
        return {
            statusCode: 200,
            message: 'Today is a holiday. No worklogs were logged.',
        };
    }

    const decryptedApiToken = decrypt(userJiraAccount.apiToken);

    const worklogs: {
        companyEmail: string;
        domain: string;
        issueKey: string;
        timeSpent: number;
    }[] = [];
    const errors: Array<{
        companyEmail: string;
        domain: string;
        issueKey: string;
        error: { message: string; details: any };
    }> = [];

    for (const issue of userJiraAccount.issues) {
        const domain = userJiraAccount.companyDomain;
        const auth = Buffer.from(`${userJiraAccount.companyEmail}:${decryptedApiToken}`).toString(
            'base64',
        );

        const alreadyLogged = await prismaService.worklogHistory.findMany({
            where: {
                issueId: issue.id,
                userId: user.sub,
            },
            orderBy: { date: 'desc' },
            take: 1,
        });

        const alreadyLoggedToday =
            alreadyLogged.length > 0 && isSameDay(alreadyLogged?.[0]?.date, today);

        if (alreadyLoggedToday) {
            console.log(
                `Worklog already logged for issue ${issue.issueKey} today for user ${user.sub}`,
            );
            errors.push({
                companyEmail: userJiraAccount.companyEmail,
                domain,
                issueKey: issue.issueKey,
                error: {
                    message: `Worklog already logged for issue ${issue.issueKey} today`,
                    details: null,
                },
            });
            continue;
        }

        await prismaService.jiraIssue.update({
            where: { id: issue.id },
            data: {
                totalSpentSoFar: (issue.totalSpentSoFar ?? 0) + issue.issueTime,
                worklogHistories: {
                    create: {
                        userId: user.sub,
                        secondsPerDay: issue.issueTime,
                        date: today,
                    },
                },
            },
        });

        const url = `https://${domain}/rest/api/3/issue/${issue.issueKey}/worklog`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${auth}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                timeSpentSeconds: issue.issueTime,
                started: new Date().toISOString().slice(0, 10) + 'T09:00:00.000-0300',
            }),
        });

        if (!response.ok) {
            errors.push({
                companyEmail: userJiraAccount.companyEmail,
                domain,
                issueKey: issue.issueKey,
                error: {
                    message: `Failed to log worklog for issue ${issue.issueKey} with status ${response.status}`,
                    details: await response.json(),
                },
            });
            continue;
        }

        console.log(
            `Worklog logged for user ${user.sub} with time spent ${issue.issueTime} minutes`,
            // { api: await response.json() },
        );

        worklogs.push({
            companyEmail: userJiraAccount.companyEmail,
            domain,
            issueKey: issue.issueKey,
            timeSpent: issue.issueTime,
        });
    }

    if (errors.length > 0) {
        console.error(
            `Errors occurred while logging worklogs for user ${user.sub}:`,
            JSON.stringify(errors, null, 2),
        );
        // implementar envio de email para o usuário com os erros
        return {
            statusCode: 400,
            errors,
        };
    }

    return {
        statusCode: 200,
        worklogs,
    };
});
