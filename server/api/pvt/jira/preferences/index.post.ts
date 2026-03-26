import { JiraPreferencesSchema } from '~/pages/dashboard/(pages)/jira/preferences/jira-preferences.schema';
import prisma from '~~/server/db/prisma';

import { convertToSeconds } from '../../../../utils/convert-to-seconds';
import { encrypt } from '../../../../utils/encrypt';

export default defineEventHandler(async (event) => {
    const user = event.context.user as { sub: string };

    try {
        const body = await readBody(event);
        const { jiraEmail, jiraApiToken, jiraIssueKey, jiraDomain, jiraIssueTime } =
            JiraPreferencesSchema.parse(body);

        const userFound = await prisma.user.findUnique({
            where: { id: user.sub },
            select: {
                id: true,
                jiraAccounts: {
                    select: { id: true, companyEmail: true, issues: true },
                },
            },
        });

        if (!userFound) {
            throw createError({ statusCode: 404, message: 'User not found' });
        }

        const encryptedApiToken = encrypt(jiraApiToken);

        await prisma.jiraAccount.upsert({
            where: {
                companyEmail_companyDomain: {
                    companyEmail: jiraEmail,
                    companyDomain: jiraDomain,
                },
            },
            update: {
                companyEmail: jiraEmail,
                companyDomain: jiraDomain,
                apiToken: encryptedApiToken,
                issues: {
                    upsert: {
                        where: {
                            id:
                                userFound.jiraAccounts
                                    .flatMap((account) => account.issues)
                                    .find((issue) => issue.issueKey === jiraIssueKey)?.id || '',
                        },
                        update: {
                            issueTime: convertToSeconds(jiraIssueTime),
                        },
                        create: {
                            issueKey: jiraIssueKey,
                            issueTime: convertToSeconds(jiraIssueTime),
                        },
                    },
                },
            },
            create: {
                userId: userFound.id,
                companyEmail: jiraEmail,
                apiToken: encryptedApiToken,
                companyDomain: jiraDomain,
                issues: {
                    create: {
                        issueKey: jiraIssueKey,
                        issueTime: convertToSeconds(jiraIssueTime),
                    },
                },
            },
        });

        return { message: 'Jira preferences saved successfully' };
    } catch (error) {
        console.error('Error saving Jira preferences:', error);
        throw createError({ statusCode: 500, message: 'Internal server error' });
    }
});
