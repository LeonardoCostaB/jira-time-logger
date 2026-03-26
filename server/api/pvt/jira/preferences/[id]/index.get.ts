import prisma from '~~/server/db/prisma';

export default defineEventHandler(async (event) => {
    const user = event.context.user as { sub: string };
    const params = event.context.params as { id: string };

    try {
        const preferences = await prisma.jiraAccount.findFirst({
            where: {
                id: params.id,
                userId: user.sub,
            },
            omit: {
                apiToken: true,
            },
        });

        if (!preferences) {
            throw createError({ statusCode: 404, message: 'Preferences not found' });
        }

        return {
            statusCode: 200,
            preferences,
        };
    } catch (error) {
        console.error('Error fetching preferences:', error);
        throw createError({ statusCode: 500, message: 'Failed to fetch preferences' });
    }
});
