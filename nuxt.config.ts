// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint'],

    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },

    typescript: {
        typeCheck: false,
    },

    runtimeConfig: {
        CRON_SECRET: process.env.CRON_SECRET,
        DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
        DISCORD_CHANNEL_ID: process.env.DISCORD_CHANNEL_ID,
    },
});
