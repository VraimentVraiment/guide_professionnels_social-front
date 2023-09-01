export default defineNuxtRouteMiddleware(() => {
  if (process.server) {
    return
  }

  const collectionsModelsStore = useCollectionsModelsStore()

  return new Promise((resolve) => {
    if (!collectionsModelsStore.collectionsModels.length) {
      collectionsModelsStore.fetch()
        .then(() => resolve())
    } else {
      resolve()
    }
  })
})
