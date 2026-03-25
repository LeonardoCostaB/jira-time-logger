import type { H3EventContext } from 'h3';
import { createError, getCookie } from 'h3';
import jwt from 'jsonwebtoken';

import { ACCESS_TOKEN_NAME } from '../constants/auth';

export interface RequestContextWithUser extends H3EventContext {
    user: {
        sub: string;
        email: string;
    };
}

export default defineEventHandler((event) => {
    if (!event.path.startsWith('/api/pvt')) return;

    const token = getCookie(event, ACCESS_TOKEN_NAME);

    if (!token) throw createError({ statusCode: 403, message: 'Forbidden' });

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET as string) as {
            sub: string;
            email: string;
        };

        event.context.user = user;
    } catch (error) {
        // log para auditoria
        if (error instanceof jwt.JsonWebTokenError) {
            console.error('Invalid JWT token:', error.message);
        } else {
            console.error('Error verifying JWT token:', error);
        }

        throw createError({ statusCode: 403, message: 'Forbidden' });
    }
});
