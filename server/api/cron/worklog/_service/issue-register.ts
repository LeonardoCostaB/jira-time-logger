import type { JiraIssue } from '~~/server/db/generated';
import { prisma } from '~~/server/db/prisma';

import { isSameDay } from '../_utils/is-same-day';
import type { JiraWorklogs } from '../index.get';

interface RegisterIssueForWorklogParams {
    user: {
        id: string;
        companyEmail: string;
        companyDomain: string;
        apiToken: string;
    };
    issues: JiraIssue[];
}

interface RegisterIssueForWorklogResult {
    worklogs: JiraWorklogs;
}

export async function registerIssueForWorklog({
    user,
    issues,
}: RegisterIssueForWorklogParams): Promise<RegisterIssueForWorklogResult> {
    const today = new Date();
    const worklogs: JiraWorklogs = [];

    for (const issue of issues) {
        const workLog = {
            companyEmail: user.companyEmail,
            domain: user.companyDomain,
            issueKey: issue.issueKey,
            timeSpent: issue.issueTime,
        };

        const alreadyLogged = await prisma.worklogHistory.findMany({
            where: {
                issueId: issue.id,
            },
            orderBy: { date: 'desc' },
            take: 1,
        });

        const alreadyLoggedToday =
            alreadyLogged.length > 0 && isSameDay(alreadyLogged?.[0]?.date, today);

        if (alreadyLoggedToday) {
            worklogs.push({
                ...workLog,
                error: {
                    message: `Worklog already logged for issue ${issue.issueKey} today for user ${user.companyEmail}`,
                    details: null,
                },
            });

            continue;
        }

        const url = `https://${user.companyDomain}/rest/api/3/issue/${issue.issueKey}/worklog`;
        const auth = Buffer.from(`${user.companyEmail}:${user.apiToken}`).toString('base64');

        try {
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
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    `Jira API Error: ${response.status} - ${JSON.stringify(errorData)}`,
                );
            }

            await prisma.jiraIssue.update({
                where: { id: issue.id },
                data: {
                    totalSpentSoFar: {
                        increment: issue.issueTime,
                    },
                    worklogHistories: {
                        create: {
                            userId: user.id,
                            secondsPerDay: issue.issueTime,
                            date: today,
                        },
                    },
                },
            });

            worklogs.push({
                ...workLog,
                error: null,
            });
        } catch (error) {
            worklogs.push({
                ...workLog,
                error: {
                    message: `Error logging worklog for issue ${issue.issueKey}: ${error instanceof Error ? error.message : String(error)}`,
                    details: JSON.stringify(error, null, 2),
                },
            });
        }
    }

    return { worklogs };
}
