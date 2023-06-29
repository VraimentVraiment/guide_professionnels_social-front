export default defineNuxtRouteMiddleware((to) => {
  const postStore = useDispositifPostStore()
  const searchStore = useSearchStore()
  const { selectedThematique } = useGpsSelectedThematiqueStore()

  if (process.server) {
    return
  }

  if (
    to.path === '/dispositifs' &&
    !selectedThematique
  ) {
    return navigateTo('/')
  }

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    if (!postStore.postsCollectionName) {
      postStore.setPostCollection('gps_fichesdispositif')
      await postStore.fetchCollection('gps_thematiques')
      await postStore.fetchCollection('gps_typesdispositif')
      searchStore.watchQuery()
    }
    resolve()
  })
})
