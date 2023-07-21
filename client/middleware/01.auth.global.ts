/**
 * Auth middleware
 */
export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) { return }

  const isAuthenticated = useIsAuthenticated()

  if (
    !isAuthenticated.value
  ) {
    let slug = to.params?.slug
    if (!slug) {
      slug = to.path
    }
    if (Array.isArray(slug)) {
      slug = slug[0]
    }

    return new Promise(async (resolve) => {
      const isPublicRoute = await useIsPublicRoute(slug)
      if (!isPublicRoute) {
        resolve(navigateTo('/login'))
      }
      resolve()
    })
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
