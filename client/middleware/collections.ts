export default defineNuxtRouteMiddleware((to) => {
  const collectionsModelsStore = useCollectionsModelsStore()
  const postStore = useDispositifPostStore()
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
      await collectionsModelsStore.fetch()
      postStore.setPostCollection('gps_fichesdispositif')
      await postStore.fetchCollection('gps_thematiques')
      await postStore.fetchCollection('gps_typesdispositif')
    }
    resolve()
  })
})
