export default defineEventHandler(() => {
    console.log('Cron job test endpoint hit at', new Date().toISOString());
    return {
        statusCode: 200,
        message: 'Cron job test endpoint hit successfully',
    };
});
