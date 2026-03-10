export default defineNuxtRouteMiddleware(async (to) => {
  const publicRoutes = ['/', '/login', '/criar-conta']
  const isPublicRoute = publicRoutes.includes(to.path)

  if (isPublicRoute) return

  try {
    const headers = useRequestHeaders(['cookie'])

    await $fetch('/api/pvt/auth/me', {
      credentials: 'include',
      headers
    })

    return
  } catch (error) {
    return navigateTo('/login')
  }
})