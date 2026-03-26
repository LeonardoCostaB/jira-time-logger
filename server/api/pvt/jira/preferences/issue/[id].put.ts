import z from 'zod';

import { prisma } from '~~/server/db/prisma';
import { convertToSeconds } from '~~/server/utils/convert-to-seconds';

const updateIssueSchema = z.object({
    issueKey: z.string().optional(),
    issueTime: z.string().optional(),
});

export default defineEventHandler(async (event) => {
    const user = event.context.user as { sub: string };
    const params = event.context.params as { id: string };

    try {
        const body = await readBody(event);
        const { issueKey, issueTime } = updateIssueSchema.parse(body);

        const updatedIssue = await prisma.jiraIssue.update({
            where: { id: params.id, jiraAccount: { is: { id: user.sub } } },
            data: {
                issueKey,
                issueTime: issueTime ? convertToSeconds(issueTime) : undefined,
            },
        });

        if (!updatedIssue) {
            throw createError({ statusCode: 404, message: 'Issue not found' });
        }

        return {
            statusCode: 200,
            body: {
                message: 'Jira issue updated successfully',
                issue: {
                    id: updatedIssue.id,
                    issueKey: updatedIssue.issueKey,
                    issueTime: updatedIssue.issueTime,
                },
            },
        };
    } catch (error) {
        console.error('Error updating issue:', error);

        if (error instanceof z.ZodError) {
            return {
                statusCode: 400,
                body: {
                    error: 'Invalid request body',
                    details: error.format(),
                },
            };
        }

        throw createError({ statusCode: 500, message: 'Failed to update issue' });
    }
});
