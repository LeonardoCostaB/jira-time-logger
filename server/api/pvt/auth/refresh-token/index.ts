import { saveRefreshToken } from '~~/server/api/auth/sign-in/services/save-refresh-token';
import { generateJWT } from '~~/server/api/auth/sign-in/utils/generate-jwt';
import { hashToken } from '~~/server/api/auth/sign-in/utils/generate-refresh-token';
import {
    ACCESS_TOKEN_NAME,
    EXPIRES_IN_ACCESS_TOKEN,
    EXPIRES_IN_REFRESH_TOKEN,
    REFRESH_TOKEN_NAME,
} from '~~/server/constants/auth';

import prismaService from '../../../../db/prisma';

export default defineEventHandler(async (event) => {
    const method = event.node.req.method;

    if (method === 'POST') {
        const body = await readBody(event);
        const { refreshToken } = body;

        try {
            const storedRefreshToken = await prismaService.refreshToken.findUnique({
                where: { tokenHash: hashToken(refreshToken) },
                select: {
                    id: true,
                    userId: true,
                    expiresAt: true,
                    user: {
                        select: {
                            email: true,
                        },
                    },
                },
            });

            if (!storedRefreshToken) {
                return createError({ statusCode: 401, message: 'Invalid refresh token' });
            }

            if (storedRefreshToken.expiresAt < new Date()) {
                await prismaService.refreshToken.delete({ where: { id: storedRefreshToken.id } });

                return createError({ statusCode: 401, message: 'Refresh token has expired' });
            }

            const [_, newRefreshToken] = await Promise.all([
                prismaService.refreshToken.delete({ where: { id: storedRefreshToken.id } }),
                saveRefreshToken(storedRefreshToken.userId),
            ]);

            const newAccessToken = generateJWT({
                payload: {
                    sub: storedRefreshToken.userId,
                    email: storedRefreshToken.user.email,
                },
            });

            setCookie(event, REFRESH_TOKEN_NAME, newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: EXPIRES_IN_REFRESH_TOKEN,
            });

            setCookie(event, ACCESS_TOKEN_NAME, newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: EXPIRES_IN_ACCESS_TOKEN,
            });

            return {
                refresh: true,
            };
        } catch (error) {
            console.error('refresh access token error:', error);

            return createError({ statusCode: 500, message: 'Internal server error' });
        }
    }

    throw createError({ statusCode: 405, message: 'Method not allowed' });
});
