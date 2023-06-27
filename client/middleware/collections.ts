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
    if (!collectionsModelsStore.collections?.length) {
      await collectionsModelsStore.fetch()
      postStore.setCollection('gps_fichesdispositif')

      await postStore.fetchFiltersCollection('gps_thematiques')
      await postStore.fetchFiltersCollection('gps_typesdispositif')
      await postStore.fetchRelationsCollection('gps_thematiques')
      await postStore.fetchRelationsCollection('gps_typesdispositif')
    }
    resolve()
  })
})
