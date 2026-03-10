// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint'],

    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },

    typescript: {
        typeCheck: false,
    },
});
