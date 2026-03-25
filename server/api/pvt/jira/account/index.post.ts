import z from 'zod';

import { decrypt, encrypt } from '~~/server/api/utils/encrypt';
import { prisma } from '~~/server/db/prisma';

const registerAccountSchema = z.object({
    companyDomain: z.string(),
    companyEmail: z.email(),
    apiToken: z.string(),
});

export default defineEventHandler(async (event) => {
    const user = event.context.user as { sub: string };

    try {
        const body = await readBody(event);
        const { companyDomain, companyEmail, apiToken } = registerAccountSchema.parse(body);

        const decryptedApiToken = decrypt(apiToken);

        const existingToken = await prisma.jiraAccount.findFirst({
            where: {
                userId: user.sub,

                companyEmail,
                apiToken: decryptedApiToken,
            },
        });

        if (existingToken) {
            return {
                statusCode: 400,
                body: {
                    error: 'A Jira app token with the same email and API token already exists for this user',
                },
            };
        }

        const encryptedApiToken = encrypt(apiToken);

        const createdAppToken = await prisma.jiraAccount.create({
            data: {
                userId: user.sub,

                companyDomain,
                companyEmail,

                apiToken: encryptedApiToken,
            },
        });

        return {
            statusCode: 201,
            body: {
                id: createdAppToken.id,
                companyDomain: createdAppToken.companyDomain,
                companyEmail: createdAppToken.companyEmail,
            },
        };
    } catch (error) {
        console.error('Error creating Jira app token:', error);
        return {
            statusCode: 500,
            body: {
                error: 'An error occurred while creating the Jira app token',
            },
        };
    }
});
