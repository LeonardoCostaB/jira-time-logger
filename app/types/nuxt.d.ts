declare module 'nuxt/app' {
    interface NuxtLayouts {
        dashboard: typeof import('~/layouts/dashboard.vue').default;
    }
}

export {};
