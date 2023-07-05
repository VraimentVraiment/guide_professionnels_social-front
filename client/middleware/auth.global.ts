/**
 * Auth middleware
 */
export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) {
    return
  }

  const isAuthenticated = useIsAuthenticated()

  if (
    !isAuthenticated.value &&
    to.path !== '/login'
  ) {
    return navigateTo('/login')
  }

  if (
    isAuthenticated.value &&
    to.path === '/login'
  ) {
    return from.path === '/login'
      ? '/'
      : from.path
  }
})
