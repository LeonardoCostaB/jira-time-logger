import z from 'zod';

import { prisma } from '~~/server/db/prisma';

const updateAccountSchema = z.object({
    companyDomain: z.string().optional(),
    companyEmail: z.email().optional(),
    apiToken: z.string().optional(),
});

export default defineEventHandler(async (event) => {
    const user = event.context.user as { sub: string };
    const params = event.context.params as { id: string };

    try {
        const body = await readBody(event);
        const { companyDomain, companyEmail, apiToken } = updateAccountSchema.parse(body);

        const updatedAccount = await prisma.jiraAccount.update({
            where: { id: params.id, userId: user.sub },
            data: {
                companyDomain,
                companyEmail,
                apiToken,
            },
        });

        if (!updatedAccount) {
            throw createError({ statusCode: 404, message: 'Jira account not found' });
        }

        return {
            statusCode: 200,
            body: {
                message: 'Jira account updated successfully',
                account: {
                    id: updatedAccount.id,
                    companyDomain: updatedAccount.companyDomain,
                    companyEmail: updatedAccount.companyEmail,
                },
            },
        };
    } catch (error) {
        console.error('Error updating Jira account:', error);
        if (error instanceof z.ZodError) {
            return {
                statusCode: 400,
                body: {
                    error: 'Invalid request body',
                    details: error.format(),
                },
            };
        }
        throw createError({ statusCode: 500, message: 'Failed to update Jira account' });
    }
});
