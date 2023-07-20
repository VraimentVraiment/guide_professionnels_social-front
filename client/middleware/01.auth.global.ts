/**
 * Auth middleware
 */
export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) { return }

  const isAuthenticated = useIsAuthenticated()

  /**
   * @todo Setup configurables public routes
   */
  const PUBLIC_ROUTES = [
    '/login',
    '/apropos',
    '/404',
    '/donnees-personnelles',
    '/mentions-legales',
    '/cookies',
    '/accessibilite',
  ]
  const isPublicRoute = (path: string) => {
    return PUBLIC_ROUTES.includes(path)
  }

  if (
    !isPublicRoute(to.path) &&
    !isAuthenticated.value
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
