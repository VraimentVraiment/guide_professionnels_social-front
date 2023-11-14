import { type RouteLocationNormalized } from 'vue-router'

/**
 * Auth middleware
 */
export default defineNuxtRouteMiddleware(async(to, from) => {
  if (process.server) {
    return
  }

  if (to.query.logout) {
    const {
      logout: directusLogout,
    } = useDirectusAuth()
    await directusLogout()
    navigateTo('/')
  }

  let isAuthenticated = Boolean(useIsAuthenticated().value)
  if (!isAuthenticated) {
    const { fetchUser } = useDirectusAuth()
    isAuthenticated = Boolean((await fetchUser()).value)
  }

  if (!isAuthenticated) {
    const isPublicRoute = useIsPublicRoute(to)
    if (!isPublicRoute) {
      return navigateTo('/auth')
    }
  }

  if (
    isAuthenticated &&
    to.path === '/auth' &&
    !to.query.request_password_reset &&
    !to.query.reset_password
  ) {
    return navigateTo(
      from.path === '/auth'
        ? '/'
        : from.path,
    )
  }
})

/**
 * Check if a page's status is set to public in Directus, given its name.
 */
export function useIsPublicRoute(
  route: RouteLocationNormalized,
): boolean {
  const DEFAULT_PUBLIC_PAGES = [
    'auth',
    '404',
    /**
     * The following pages are public by default, but can be made private individually
     * by setting their status to "published-private" in Directus.
     */
    'content-slug',
  ]

  if (DEFAULT_PUBLIC_PAGES.includes(String(route?.name))) {
    return true
  }
  return false
}
