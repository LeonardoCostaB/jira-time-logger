import prismaService from '~~/server/db/prisma';

/**
 *
 * @param date
 * @arguments date - string in the format 'YYYY-MM-DD'
 * @returns true if the date is a holiday, false otherwise
 */
export async function isHoliday(date: string): Promise<boolean> {
    try {
        const year = new Date(date).getFullYear();

        const holiday = await prismaService.daysOff.findFirst({
            where: { holidDaysYear: year, date },
        });

        return !!holiday;
    } catch (error) {
        console.error(`Error checking holiday for date ${date}:`, error);
        return false;
    }
}
