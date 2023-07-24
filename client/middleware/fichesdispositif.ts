export default defineNuxtRouteMiddleware((to) => {
  if (process.server) {
    return
  }

  const selectedThematiqueStore = useGpsSelectedThematiqueStore()

  if (
    to.path === '/dispositifs' &&
    !selectedThematiqueStore.selectedThematique
  ) {
    return navigateTo('/')
  }

  return new Promise((resolve) => {
    const postStore = useDispositifPostStore()
    if (!postStore.postsCollectionName) {
      postStore.setPostCollection('gps_fichesdispositif')
      Promise.allSettled([
        postStore.fetchCollection('gps_thematiques'),
        postStore.fetchCollection('gps_typesdispositif'),
      ]).then(() => {
        resolve()
      })
    } else {
      resolve()
    }
  })
})
