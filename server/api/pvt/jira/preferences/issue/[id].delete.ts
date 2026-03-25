import prisma from '~~/server/db/prisma';

export default defineEventHandler(async (event) => {
    const user = event.context.user as { sub: string };
    const params = event.context.params as { id: string };

    try {
        const { jiraAccountId } = await readBody(event);
        const issueKey = params.id;

        if (!issueKey || !jiraAccountId) {
            throw createError({
                statusCode: 400,
                message: 'Issue key and Jira account ID are required',
            });
        }

        const deletedIssue = await prisma.jiraIssue.delete({
            where: {
                issueKey_jiraAccountId: {
                    issueKey,
                    jiraAccountId,
                },
                jiraAccount: {
                    is: {
                        id: user.sub,
                    },
                },
            },
        });

        if (!deletedIssue) {
            throw createError({ statusCode: 404, message: 'Issue not found' });
        }

        return {
            message: 'Issue deleted successfully',
            success: true,
            issueKey: deletedIssue.issueKey,
        };
    } catch (error) {
        console.error('Error deleting issue:', error);
        throw createError({ statusCode: 500, message: 'Failed to delete issue' });
    }
});
