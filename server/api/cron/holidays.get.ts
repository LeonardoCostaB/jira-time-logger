import prismaService from '~~/server/db/prisma';

type BrazilApiHoliday = {
    date: string; // 'YYYY-MM-DD'
    name: string;
    type: string;
};

const brazilAPI = 'https://brasilapi.com.br/api/feriados/v1';

export default defineEventHandler(async () => {
    try {
        const currentYear = new Date().getFullYear();

        const holidaysFound = await prismaService.holiDays.findFirst({
            where: { year: currentYear },
            include: {
                daysOff: true,
            },
        });

        if (!holidaysFound) {
            const getCurrentYear = new Date().getFullYear();
            const fetchData = await $fetch<BrazilApiHoliday[]>(`${brazilAPI}/${getCurrentYear}`);

            if (fetchData && Array.isArray(fetchData)) {
                await prismaService.holiDays.create({
                    data: {
                        year: getCurrentYear,
                        daysOff: {
                            create: fetchData.map((holiday) => ({
                                date: holiday.date,
                                name: holiday.name,
                                type: holiday.type,
                            })),
                        },
                    },
                });

                return {
                    statusCode: 200,
                    holidays: fetchData,
                };
            }
        }

        return {
            statusCode: 200,
            holidays: holidaysFound?.daysOff,
        };
    } catch (error) {
        console.error('Error fetching holidays:', error);
        return {
            statusCode: 500,
            message: 'Error fetching holidays',
        };
    }
});
