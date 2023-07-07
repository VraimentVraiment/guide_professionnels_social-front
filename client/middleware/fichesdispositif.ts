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

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const postStore = useDispositifPostStore()
    if (!postStore.postsCollectionName) {
      postStore.setPostCollection('gps_fichesdispositif')
      await postStore.fetchCollection('gps_thematiques')
      await postStore.fetchCollection('gps_typesdispositif')
    }
    resolve()
  })
})
