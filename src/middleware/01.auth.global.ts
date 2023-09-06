/**
 * Auth middleware
 */
export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) { return }

  return new Promise<void>((resolve) => {
    useIsAuthenticated()
      .then((isAuthenticated) => {
        if (
          isAuthenticated.value &&
          to.path === '/login'
        ) {
          resolve(navigateTo(
            from.path === '/login'
              ? '/'
              : from.path,
          ) as void)
        }

        if (!isAuthenticated.value) {
          const pageName = to.params?.slug?.[0] ?? to.name as string
          let slug = to.params?.slug
          if (!slug) {
            slug = to.path
          }
          if (Array.isArray(slug)) {
            slug = slug[0]
          }

          useIsPublicPage(pageName as string)
            .then((isPublicRoute) => {
              if (!isPublicRoute) {
                resolve(navigateTo('/login') as void)
              } else {
                resolve()
              }
            })
        } else {
          resolve()
        }
      })
  })
})
