import { EXPIRES_IN_REFRESH_TOKEN } from '~~/server/constants/auth';

import prismaService from '../../../../db/prisma';
import { createRefreshToken, hashToken } from '../utils/generate-refresh-token';

async function saveRefreshToken(userId: string): Promise<string> {
    const refreshToken = createRefreshToken();
    const hashedToken = hashToken(refreshToken);

    await prismaService.refreshToken.create({
        data: {
            tokenHash: hashedToken,
            userId,
            expiresAt: new Date(Date.now() + EXPIRES_IN_REFRESH_TOKEN), // 30 days
        },
    });

    return refreshToken;
}

export { saveRefreshToken };
