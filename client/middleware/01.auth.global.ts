/**
 * Auth middleware
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) { return }

  const isAuthenticated = await useIsAuthenticated()

  if (
    isAuthenticated.value &&
    to.path === '/login'
  ) {
    return from.path === '/login'
      ? '/'
      : from.path
  }

  if (
    !isAuthenticated.value
  ) {
    return new Promise((resolve) => {
      let slug = to.params?.slug
      if (!slug) {
        slug = to.path
      }
      if (Array.isArray(slug)) {
        slug = slug[0]
      }

      useIsPublicRoute(slug as string)
        .then((isPublicRoute) => {
          if (!isPublicRoute) {
            resolve(navigateTo('/login'))
          } else {
            resolve()
          }
        })
    })
  }
})
