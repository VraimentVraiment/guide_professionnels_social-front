export default defineNuxtRouteMiddleware((to) => {
  const collectionsModelStore = useCollectionsModel()
  const postStore = useDispositifPostStore()
  const { selectedThematique } = useGpsCollectionsStore()

  if (process.server) {
    return
  }

  return new Promise(async (resolve) => {
    if (!collectionsModelStore.collections?.length) {
      await collectionsModelStore.fetch()
      postStore.setCollection('gps_fichesdispositif')
      await postStore.fetchFiltersCollections()
      await postStore.fetchRelationsCollections()
    }

    if (
      to.path === '/dispositifs' &&
      !selectedThematique
    ) {
      return resolve(navigateTo('/'))
    } else {
      return resolve()
    }
  })
})
