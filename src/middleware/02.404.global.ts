export default defineNuxtRouteMiddleware((to) => {
  if (process.client) {
    return
  }

  if (to.path !== '/404') {
    const routeExists = to.matched.length > 0
    if (!routeExists) {
      return navigateTo('/404')
    }
  }
})
