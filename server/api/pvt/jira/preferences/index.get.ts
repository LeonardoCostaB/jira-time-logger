import prismaService from '~~/server/db/prisma';

export default defineEventHandler(async (event) => {
    const user = event.context.user as { sub: string };

    try {
        const userFound = await prismaService.user.findUnique({
            where: { id: user.sub },
            select: {
                jiraAccounts: {
                    include: {
                        issues: true,
                    },
                },
            },
        });

        if (!userFound) {
            throw createError({ statusCode: 404, message: 'User not found' });
        }

        if (!userFound.jiraAccounts || userFound.jiraAccounts.length === 0) {
            throw createError({ statusCode: 404, message: 'Jira preferences not found' });
        }

        if (!userFound.jiraAccounts?.[0]?.active) {
            throw createError({ statusCode: 404, message: 'Jira preferences not active' });
        }

        return userFound.jiraAccounts.map((account) => ({
            id: account.id,
            companyEmail: account.companyEmail,
            active: account.active,
            issues: account.issues.map((issue) => ({
                // id: issue.id,
                issueKey: issue.issueKey,
                issueTime: issue.issueTime,
                active: issue.active,
                totalSpentSoFar: issue.totalSpentSoFar,
            })),
        }));
    } catch (error) {
        console.error('Error fetching Jira preferences:', error);
        return {};
    }
});
