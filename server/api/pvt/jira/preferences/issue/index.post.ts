import { z } from 'zod';

import prisma from '~~/server/db/prisma';
import { convertToSeconds } from '~~/server/utils/convert-to-seconds';

const createIssueSchema = z.object({
    jiraAccountId: z.string(),
    issueKey: z.string(),
    issueTime: z.string(),
});

export default defineEventHandler(async (event) => {
    const user = event.context.user as { sub: string };

    try {
        const body = await readBody(event);
        const { jiraAccountId, issueKey, issueTime } = createIssueSchema.parse(body);

        const createdIssue = await prisma.jiraIssue.create({
            data: {
                jiraAccount: {
                    connect: { id: jiraAccountId, userId: user.sub },
                },
                issueKey,
                issueTime: convertToSeconds(issueTime),
            },
        });

        return {
            statusCode: 201,
            body: {
                message: 'Jira issue created successfully',
                issue: {
                    id: createdIssue.id,
                    issueKey: createdIssue.issueKey,
                    issueTime: createdIssue.issueTime,
                },
            },
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                statusCode: 400,
                body: {
                    error: 'Invalid request body',
                    details: error.format(),
                },
            };
        }

        console.error('Error creating Jira issue:', error);

        return {
            statusCode: 500,
            body: {
                error: 'An error occurred while creating the Jira issue',
            },
        };
    }
});
