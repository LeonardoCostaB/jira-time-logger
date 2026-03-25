import prisma from '~~/server/db/prisma';

export default defineEventHandler(async (event) => {
    const user = event.context.user as { sub: string };
    const params = event.context.params as { id: string };

    try {
        const deletedAccount = await prisma.jiraAccount.delete({
            where: { id: params.id, userId: user.sub },
        });

        if (!deletedAccount) {
            throw createError({ statusCode: 404, message: 'Jira account not found' });
        }

        return {
            statusCode: 200,
            body: {
                message: 'Jira account deleted successfully',
            },
        };
    } catch (error) {
        console.error('Error deleting Jira account:', error);
        throw createError({ statusCode: 500, message: 'Failed to delete Jira account' });
    }
});
