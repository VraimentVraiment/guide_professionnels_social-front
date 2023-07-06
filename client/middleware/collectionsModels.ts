export default defineNuxtRouteMiddleware(() => {
  if (process.server) {
    return
  }

  const collectionsModelsStore = useCollectionsModelsStore()

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    if (!collectionsModelsStore.collectionsModels.length) {
      await collectionsModelsStore.fetch()
    }
    resolve()
  })
})
