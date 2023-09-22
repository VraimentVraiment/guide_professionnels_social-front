import { RouteLocationNormalized } from 'vue-router'

/**
 * Auth middleware
 */
export default defineNuxtRouteMiddleware(async(to, from) => {
  let isAuthenticated = Boolean(useIsAuthenticated().value)

  if (!isAuthenticated) {
    if (process.server) {
      const { fetchUser } = useDirectusAuth()
      isAuthenticated = Boolean((await fetchUser()).value)
    }
  }

  if (!isAuthenticated) {
    const isPublicRoute = useIsPublicRoute(to)
    if (!isPublicRoute) {
      return navigateTo('/login')
    }
  }

  if (isAuthenticated) {
    if (
      to.path === '/login'
    ) {
      return navigateTo(
        from.path === '/login'
          ? '/'
          : from.path,
      )
    }
  }
})

/**
 * Check if a page's status is set to public in Directus, given its name.
 */
export function useIsPublicRoute(
  route: RouteLocationNormalized,
): boolean {
  const DEFAULT_PUBLIC_PAGES = [
    'login',
    '404',
    /**
     * The following pages are public by default, but can be made private individually
     * by setting their status to "published-private" in Directus.
     * this status will be checked in validate middleware in the page itself
     */
    'content-slug',
  ]

  if (DEFAULT_PUBLIC_PAGES.includes(String(route?.name))) {
    return true
  }
  return false
}
