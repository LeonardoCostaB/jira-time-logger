import { createError, defineEventHandler, getHeader, getRequestURL } from 'h3';

const cronAuthMiddleware = defineEventHandler((event) => {
    const url = getRequestURL(event);

    if (url.pathname.startsWith('/api/cron')) {
        const config = useRuntimeConfig();
        const authHeader = getHeader(event, 'authorization') || '';

        if (authHeader !== `Bearer ${config.CRON_SECRET}`) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized: Cron access restricted',
            });
        }
    }
});

export default cronAuthMiddleware;
