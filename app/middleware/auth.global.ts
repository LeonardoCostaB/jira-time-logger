export default defineNuxtRouteMiddleware(async (to) => {
    const headers = useRequestHeaders(['cookie']);

    const publicRoutes = ['/', '/login', '/criar-conta'];
    const isPublicRoute = publicRoutes.includes(to.path);

    if (isPublicRoute) {
        if (headers.cookie?.includes('client-access-token')) {
            return navigateTo('/dashboard');
        }

        return;
    }

    try {
        await $fetch('/api/pvt/auth/me', {
            credentials: 'include',
            headers,
        });

        return;
    } catch (error) {
        console.error('Authentication error:', error);
        return navigateTo('/login');
    }
});
